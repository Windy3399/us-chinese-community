@echo off
echo ==== Checking for WSL and Bash ====
where wsl.exe 2>nul && echo WSL found: %%PATH%%
where bash.exe 2>nul && echo Bash found: %%PATH%%
where git-bash.exe 2>nul && echo Git Bash found: %%PATH%%
where wsl 2>nul && echo wsl in PATH
echo.
echo ==== Checking WSL status ====
wsl.exe --status 2>nul || echo WSL not available
