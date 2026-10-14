@echo off
rem ==================================================================
rem  RATON BENTO BOX - Subida a GitHub + despliegue en GitHub Pages
rem  Repositorio: https://github.com/CoipoNorte/Raton-Bento-Box
rem  Uso: doble clic en deploy.bat o ejecutarlo desde esta carpeta
rem  Regla de oro respetada: npm, npx y node siempre con CALL,
rem  porque son scripts .cmd y sin call el padre muere en silencio.
rem ==================================================================
chcp 65001 >nul
setlocal
title Raton Bento Box - Despliegue a GitHub Pages

set "REPO_URL=https://github.com/CoipoNorte/Raton-Bento-Box.git"
set "WEB_URL=https://coiponorte.github.io/Raton-Bento-Box/"

echo.
echo ================================================================
echo   RATON BENTO BOX ^> Despliegue automatico a GitHub Pages
echo   Repositorio: %REPO_URL%
echo   Destino web: %WEB_URL%
echo ================================================================
echo.

rem ---- [1/11] Node.js y npm -----------------------------------------
echo [1/11] Comprobando Node.js y npm...
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERROR] No se encontro Node.js.
  echo         Instalalo desde https://nodejs.org y reintenta.
  goto :error
)
where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERROR] No se encontro npm. Reinstala Node.js.
  goto :error
)
for /f "delims=" %%v in ('npm -v') do set NPM_VER=%%v
echo        OK - npm %NPM_VER% detectado.
echo.

rem ---- [2/11] Git, repositorio y remoto ------------------------------
echo [2/11] Comprobando Git y el repositorio...
where git >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERROR] No se encontro Git. Instalalo desde https://git-scm.com
  goto :error
)
if not exist package.json (
  echo [ERROR] No hay package.json. Ejecuta el script dentro de la carpeta del proyecto.
  goto :error
)
call git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo        Inicializando repositorio Git...
  call git init
  if errorlevel 1 (
    echo [ERROR] No se pudo inicializar el repositorio.
    goto :error
  )
)
call git remote get-url origin >nul 2>nul
if errorlevel 1 (
  echo        Agregando remoto origin...
  call git remote add origin "%REPO_URL%"
)
call git remote set-url origin "%REPO_URL%"
if errorlevel 1 (
  echo [ERROR] No se pudo configurar el remoto origin.
  goto :error
)
call git branch -M main >nul 2>nul
echo        OK - remoto origin apunta a %REPO_URL%
echo.

rem ---- [3/11] .gitignore ----------------------------------------------
echo [3/11] Comprobando .gitignore...
if not exist .gitignore (
  echo        Creando .gitignore...
  echo node_modules/> .gitignore
  echo dist/>> .gitignore
  echo dist-ssr/>> .gitignore
  echo *.local>> .gitignore
  echo .vite/>> .gitignore
  echo .vite-cache/>> .gitignore
  echo logs/>> .gitignore
  echo *.log>> .gitignore
  echo npm-debug.log*>> .gitignore
  echo .DS_Store>> .gitignore
  echo Thumbs.db>> .gitignore
  echo desktop.ini>> .gitignore
  echo .vscode/>> .gitignore
  echo .idea/>> .gitignore
  echo .env>> .gitignore
  echo .env.*>> .gitignore
)
echo        OK.
echo.

rem ---- [4/11] Scripts predeploy y deploy en package.json --------------
echo [4/11] Agregando scripts de despliegue a package.json...
call node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.name='raton-bento-box';p.scripts=p.scripts||{};p.scripts.predeploy='npm run build';p.scripts.deploy='gh-pages -d dist';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');console.log('       OK - scripts predeploy y deploy anadidos.');"
if errorlevel 1 (
  echo [ERROR] No se pudo actualizar package.json.
  goto :error
)
echo.

rem ---- [5/11] Base en vite.config.ts ----------------------------------
echo [5/11] Configurando base /Raton-Bento-Box/ en vite.config.ts...
call node -e "const fs=require('fs');const f='vite.config.ts';let s=fs.readFileSync(f,'utf8');const q=String.fromCharCode(39);if(s.indexOf('/Raton-Bento-Box/')>-1){console.log('       OK - base ya configurada.');process.exit(0);}const linea='  base: '+q+'/Raton-Bento-Box/'+q+',';if(/base\s*:/.test(s)){s=s.replace(/base\s*:[^\n]+/,linea);}else{s=s.replace('export default defineConfig({','export default defineConfig({\n'+linea);}fs.writeFileSync(f,s);console.log('       OK - base insertada automaticamente.');"
if errorlevel 1 (
  echo [ERROR] No se pudo leer o escribir vite.config.ts
  goto :error
)
echo.

rem ---- [6/11] Dependencias y gh-pages ---------------------------------
echo [6/11] Instalando dependencias y gh-pages...
call npm install
if errorlevel 1 (
  echo [ERROR] Fallo npm install. Revisa tu conexion y package.json.
  goto :error
)
call npm ls gh-pages >nul 2>nul
if errorlevel 1 (
  echo        Instalando gh-pages como dependencia de desarrollo...
  call npm install -D gh-pages
  if errorlevel 1 (
    echo [ERROR] No se pudo instalar gh-pages.
    goto :error
  )
)
call npm ls gh-pages >nul 2>nul
if errorlevel 1 (
  echo [ERROR] gh-pages sigue sin aparecer tras la instalacion.
  goto :error
)
echo        OK - dependencias y gh-pages listos.
echo.

rem ---- [7/11] Compilar -------------------------------------------------
echo [7/11] Compilando el proyecto, npm run build...
call npm run build
if errorlevel 1 (
  echo [ERROR] Fallo la compilacion. Revisa los errores de arriba.
  goto :error
)
if not exist dist\index.html (
  echo [ERROR] No se genero dist\index.html
  goto :error
)
echo        OK - carpeta dist generada.
echo.

rem ---- [8/11] Commit de todos los archivos ------------------------------
echo [8/11] Guardando cambios con git add y commit...
call git add -A
if errorlevel 1 (
  echo [ERROR] Fallo git add.
  goto :error
)
call git diff --cached --quiet
if errorlevel 1 (
  call git commit -m "chore: despliegue Raton Bento Box"
  if errorlevel 1 (
    echo [ERROR] Fallo git commit. Configura identidad con:
    echo         git config --global user.name Tu Nombre
    echo         git config --global user.email tu@correo.com
    goto :error
  )
  echo        OK - commit creado.
) else (
  echo        OK - no habia cambios que confirmar.
)
echo.

rem ---- [9/11] Push del codigo fuente ------------------------------------
echo [9/11] Subiendo codigo a GitHub, git push origin main...
call git push -u origin main
if errorlevel 1 (
  echo [ERROR] Fallo git push. Comprueba credenciales y que el
  echo         repositorio Raton-Bento-Box existe en tu cuenta.
  goto :error
)
echo        OK - codigo subido a main.
echo.

rem ---- [10/11] Publicar dist en gh-pages ---------------------------------
echo [10/11] Publicando dist en GitHub Pages...
call npm run deploy >nul 2>nul
if errorlevel 1 (
  echo        Reintentando con npx gh-pages...
  call npx gh-pages -d dist
)
if errorlevel 1 (
  echo [ERROR] Fallo la publicacion con gh-pages.
  echo         Comprueba el remoto con: git remote -v
  goto :error
)
echo        OK - dist publicado en la rama gh-pages.
echo.

rem ---- [11/11] Comprobacion final ----------------------------------------
echo [11/11] Verificando rama gh-pages en remoto...
call git branch -r > tmp_ramas.txt 2>nul
findstr /C:"origin/gh-pages" tmp_ramas.txt >nul 2>nul
if errorlevel 1 (
  echo        Aviso: gh-pages aun no visible en remoto.
) else (
  echo        OK - gh-pages confirmada.
)
del tmp_ramas.txt >nul 2>nul
echo.

echo ================================================================
echo   DESPLIEGUE COMPLETADO
echo.
echo   Codigo: %REPO_URL%
echo   Web:    %WEB_URL%
echo.
echo   ULTIMO PASO, solo la primera vez:
echo     1. Entra a tu repositorio en GitHub ^> Settings ^> Pages
echo     2. En 'Build and deployment' elige:
echo        Branch: gh-pages   /   Folder: / root
echo     3. Espera 1-2 minutos y recarga con Ctrl+F5
echo        para limpiar la cache del navegador
echo ================================================================
echo.
pause
exit /b 0

:error
echo.
echo ================================================================
echo   El despliegue se detuvo en el paso anterior.
echo   Corrige el problema y vuelve a ejecutar deploy.bat
echo   Puedes reejecutarlo tantas veces como quieras.
echo ================================================================
echo.
pause
exit /b 1
