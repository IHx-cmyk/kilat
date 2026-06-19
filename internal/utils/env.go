package utils

import (
	"bufio"
	"os"
	"strings"
)

// LoadEnv reads a .env file from the current directory, parses it,
// and sets the environment variables.
func LoadEnv() {
	file, err := os.Open(".env")
	if err != nil {
		// Skip silently if the file doesn't exist
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) < 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])

		// Strip double or single quotes around value
		if len(value) >= 2 {
			if (strings.HasPrefix(value, "\"") && strings.HasSuffix(value, "\"")) ||
				(strings.HasPrefix(value, "'") && strings.HasSuffix(value, "'")) {
				value = value[1 : len(value)-1]
			}
		}

		os.Setenv(key, value)
	}
}
