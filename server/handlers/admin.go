package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AdminHandler struct {
	db *pgxpool.Pool
}

func NewAdminHandler(db *pgxpool.Pool) *AdminHandler {
	return &AdminHandler{db: db}
}

type UserResponse struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"emailVerified"`
	Image         string `json:"image,omitempty"`
	CreatedAt     string `json:"createdAt"`
	UpdatedAt     string `json:"updatedAt"`
}

type UsersListResponse struct {
	Users      []UserResponse `json:"users"`
	Total      int            `json:"total"`
	Page       int            `json:"page"`
	PageSize   int            `json:"pageSize"`
	TotalPages int            `json:"totalPages"`
}

func (h *AdminHandler) GetUsers(c *gin.Context) {
	// Get pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "20"))
	search := c.Query("search")

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize

	// Build query with snake_case column names
	var countQuery, selectQuery string
	var args []interface{}

	if search != "" {
		countQuery = `SELECT COUNT(*) FROM "user" WHERE name ILIKE $1 OR email ILIKE $1`
		selectQuery = `
			SELECT id, name, email, email_verified, image, created_at, updated_at
			FROM "user"
			WHERE name ILIKE $1 OR email ILIKE $1
			ORDER BY created_at DESC
			LIMIT $2 OFFSET $3
		`
		searchPattern := "%" + search + "%"
		args = []interface{}{searchPattern, pageSize, offset}
	} else {
		countQuery = `SELECT COUNT(*) FROM "user"`
		selectQuery = `
			SELECT id, name, email, email_verified, image, created_at, updated_at
			FROM "user"
			ORDER BY created_at DESC
			LIMIT $1 OFFSET $2
		`
		args = []interface{}{pageSize, offset}
	}

	// Get total count
	var total int
	var err error
	if search != "" {
		err = h.db.QueryRow(c.Request.Context(), countQuery, "%"+search+"%").Scan(&total)
	} else {
		err = h.db.QueryRow(c.Request.Context(), countQuery).Scan(&total)
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count users", "details": err.Error()})
		return
	}

	// Get users
	rows, err := h.db.Query(c.Request.Context(), selectQuery, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users", "details": err.Error()})
		return
	}
	defer rows.Close()

	users := []UserResponse{}
	for rows.Next() {
		var user UserResponse
		var imageNull sql.NullString
		var createdAt, updatedAt time.Time
		err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.Email,
			&user.EmailVerified,
			&imageNull,
			&createdAt,
			&updatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan user row", "details": err.Error()})
			return
		}
		if imageNull.Valid {
			user.Image = imageNull.String
		}
		user.CreatedAt = createdAt.Format(time.RFC3339)
		user.UpdatedAt = updatedAt.Format(time.RFC3339)
		users = append(users, user)
	}

	totalPages := (total + pageSize - 1) / pageSize

	c.JSON(http.StatusOK, UsersListResponse{
		Users:      users,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	})
}
