package main

import (
	"fmt"
	"os"
	"path/filepath"
	"time"
	"jolt/internal/engine"
	"jolt/internal/pkgmanager"
	"jolt/internal/utils"
	"jolt/internal/initcmd"
	"github.com/fatih/color"
)

func main() {
	// Load environment variables from .env on startup
	utils.LoadEnv()

	if len(os.Args) == 2 && (os.Args[1] == "--version" || os.Args[1] == "-v") {
		fmt.Printf("Jolt v%s\n", utils.Version)
		return
	}

	if len(os.Args) < 2 {
		printHelp()
		return
	}

	switch os.Args[1] {
	case "run":
		if len(os.Args) < 3 {
			color.Red("❌ Gunakan: jolt run <file.js> [--watch]")
			return
		}

		watchMode := false
		var filePath string
		for _, arg := range os.Args[2:] {
			if arg == "--watch" || arg == "-w" {
				watchMode = true
			} else {
				filePath = arg
			}
		}

		if filePath == "" {
			color.Red("❌ Gunakan: jolt run <file.js> [--watch]")
			return
		}

		if watchMode {
			runAndWatch(filePath)
		} else {
			executeFile(filePath)
		}

	case "add":
		if len(os.Args) < 3 {
			color.Red("❌ Gunakan: jolt add <package>")
			return
		}
		pkg := os.Args[2]
		if err := pkgmanager.Add(pkg); err != nil {
			color.Red("❌ Gagal install: %v", err)
			os.Exit(1)
		}
	case "init":
		if err := initcmd.RunInit(); err != nil {
			color.Red("❌ Gagal init: %v", err)
			os.Exit(1)
		}
	default:
		printHelp()
	}
}

func executeFile(filePath string) {
	runtime := engine.New(engine.DefaultOptions())
	if err := runtime.RunFile(filePath); err != nil {
		color.Red("❌ Error: %v", err)
	}
}

func runAndWatch(filePath string) {
	cyan := color.New(color.FgCyan, color.Bold)
	cyan.Println("👀 Watch mode aktif. Menunggu perubahan file (.js / .json)...")
	executeFile(filePath)

	lastModTime := getMaxModTime()
	for {
		time.Sleep(500 * time.Millisecond)
		currentModTime := getMaxModTime()
		if currentModTime.After(lastModTime) {
			lastModTime = currentModTime
			cyan.Println("\n🔄 Perubahan terdeteksi. Memulai ulang...")
			executeFile(filePath)
		}
	}
}

func getMaxModTime() time.Time {
	var maxTime time.Time
	_ = filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if info.IsDir() {
			name := info.Name()
			if name == ".git" || name == ".jolt" || name == "node_modules" || name == "website" {
				return filepath.SkipDir
			}
			return nil
		}
		ext := filepath.Ext(path)
		if ext == ".js" || ext == ".json" {
			if info.ModTime().After(maxTime) {
				maxTime = info.ModTime()
			}
		}
		return nil
	})
	return maxTime
}

func printHelp() {
	cyan := color.New(color.FgCyan, color.Bold)
	cyan.Printf("🚀 Jolt v%s - Fast JS Runtime for Termux\n", utils.Version)
	fmt.Println()
	color.White("Penggunaan:")
	color.Yellow("  jolt init                 Inisialisasi proyek Jolt (package.json)")
	color.Yellow("  jolt run <file.js> [-w]   Jalankan file JavaScript (opsional: watch mode)")
	color.Yellow("  jolt add <package>        Install package dari npm")
	color.Yellow("  jolt --version            Tampilkan versi")
	fmt.Println()
	color.White("Contoh:")
	color.Cyan("  jolt init")
	color.Cyan("  jolt run index.js --watch")
	color.Cyan("  jolt add lodash")
}