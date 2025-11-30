// Script para atualizar todas as URLs da API
// Execute com: node update-api-urls.js

const fs = require('fs');
const path = require('path');

const files = [
    'src/components/auth/LoginPage.jsx',
    'src/components/auth/RegisterPage.jsx',
    'src/components/dashboard/LogoutButton.jsx',
    'src/components/Dashboard.jsx',
    'src/components/EmailVerificationBanner.jsx',
    'src/pages/ForgotPasswordPage.jsx',
    'src/pages/ResetPasswordPage.jsx',
    'src/pages/VerifyEmailPage.jsx',
    'src/lib/auth-client.js'
];

const replacements = {
    '"http://localhost:3000/api/auth/sign-in"': 'API_ENDPOINTS.AUTH.SIGN_IN',
    "'http://localhost:3000/api/auth/sign-in'": 'API_ENDPOINTS.AUTH.SIGN_IN',
    '"http://localhost:3000/api/auth/sign-up"': 'API_ENDPOINTS.AUTH.SIGN_UP',
    "'http://localhost:3000/api/auth/sign-up'": 'API_ENDPOINTS.AUTH.SIGN_UP',
    '"http://localhost:3000/api/auth/sign-out"': 'API_ENDPOINTS.AUTH.SIGN_OUT',
    "'http://localhost:3000/api/auth/sign-out'": 'API_ENDPOINTS.AUTH.SIGN_OUT',
    '"http://localhost:3000/api/auth/session"': 'API_ENDPOINTS.AUTH.SESSION',
    "'http://localhost:3000/api/auth/session'": 'API_ENDPOINTS.AUTH.SESSION',
    '"http://localhost:3000/api/auth/forgot-password"': 'API_ENDPOINTS.AUTH.FORGOT_PASSWORD',
    "'http://localhost:3000/api/auth/forgot-password'": 'API_ENDPOINTS.AUTH.FORGOT_PASSWORD',
    '"http://localhost:3000/api/auth/reset-password"': 'API_ENDPOINTS.AUTH.RESET_PASSWORD',
    "'http://localhost:3000/api/auth/reset-password'": 'API_ENDPOINTS.AUTH.RESET_PASSWORD',
    '"http://localhost:3000/api/auth/verify-email': 'API_ENDPOINTS.AUTH.VERIFY_EMAIL',
    "'http://localhost:3000/api/auth/verify-email": 'API_ENDPOINTS.AUTH.VERIFY_EMAIL',
    '"http://localhost:3000/api/auth/resend-verification"': 'API_ENDPOINTS.AUTH.RESEND_VERIFICATION',
    "'http://localhost:3000/api/auth/resend-verification'": 'API_ENDPOINTS.AUTH.RESEND_VERIFICATION',
    'baseURL: "http://localhost:3000"': 'baseURL: API_URL',
    "baseURL: 'http://localhost:3000'": 'baseURL: API_URL'
};

const importStatement = `import { API_ENDPOINTS, API_URL } from '../config/api';\n`;
const importStatementAlt = `import { API_ENDPOINTS, API_URL } from '../../config/api';\n`;

files.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Add import if not present
    if (!content.includes('from \'../config/api\'') && !content.includes('from \'../../config/api\'')) {
        const importToUse = filePath.includes('/pages/') ? importStatementAlt : importStatement;
        const firstImportIndex = content.indexOf('import');
        if (firstImportIndex !== -1) {
            const endOfFirstImport = content.indexOf('\n', firstImportIndex);
            content = content.slice(0, endOfFirstImport + 1) + importToUse + content.slice(endOfFirstImport + 1);
            modified = true;
        }
    }

    // Replace URLs
    Object.entries(replacements).forEach(([oldUrl, newUrl]) => {
        if (content.includes(oldUrl)) {
            content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Atualizado: ${filePath}`);
    } else {
        console.log(`⏭️  Sem mudanças: ${filePath}`);
    }
});

console.log('\n✨ Concluído!');
