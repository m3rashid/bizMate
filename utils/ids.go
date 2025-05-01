package utils

import (
	"encoding/hex"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func ToPgTypeUUID(u uuid.UUID) pgtype.UUID {
	return pgtype.UUID{Bytes: u, Valid: true}
}

func StringToPgTypeUuid(s string) pgtype.UUID {
	data, err := parseUUID(s)
	if err != nil {
		return pgtype.UUID{
			Bytes: [16]byte{},
			Valid: false,
		}
	}
	return pgtype.UUID{
		Bytes: data,
		Valid: true,
	}
}

func parseUUID(src string) (dst [16]byte, err error) {
	switch len(src) {
	case 36:
		src = src[0:8] + src[9:13] + src[14:18] + src[19:23] + src[24:]
	case 32: // dashes already stripped, assume valid
	default: // assume invalid.
		return dst, fmt.Errorf("cannot parse UUID %v", src)
	}

	buf, err := hex.DecodeString(src)
	if err != nil {
		return dst, err
	}

	copy(dst[:], buf)
	return dst, err
}

func PgTypeUUIDToString(t pgtype.UUID) string {
	if !t.Valid {
		return ""
	}
	src := t.Bytes
	return fmt.Sprintf("%x-%x-%x-%x-%x", src[0:4], src[4:6], src[6:8], src[8:10], src[10:16])
}
