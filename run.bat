@echo off
echo ==== Ouverture du backend dans VS Code ====
cd asanai
start powershell -NoExit -Command "mvn spring-boot:run"

echo ==== Ouverture du frontend dans VS Code ====
cd ../front
start powershell -NoExit -Command "npm run dev"

echo ==== Les deux serveurs sont lancés et les projets ouverts dans VS Code ! ====
pause
