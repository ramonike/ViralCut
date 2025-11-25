# Guia: Como Encontrar a Connection String no Supabase

## Passo a Passo

1. Acesse seu projeto Supabase:
   https://supabase.com/dashboard/project/wpguzmkmxpwlliksyauv

2. No menu lateral esquerdo, clique em "Settings" (ícone de engrenagem)

3. Clique em "Database"

4. Role a página até encontrar a seção "Connection string"

5. Você verá abas como:
   - Transaction
   - Session  
   - Direct connection

6. Clique na aba "Transaction" ou "Session"

7. Copie a string completa que aparece

## Formato Esperado

A connection string deve ser parecida com:

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

## Importante

- Use "Transaction" ou "Session" (não "Direct connection")
- O host deve conter "pooler.supabase.com"
- A porta deve ser 6543 (não 5432)

## Próximo Passo

Depois de copiar, cole a connection string aqui para eu configurar o banco de dados.
