# Podrabotki-Test — PWA (Android + iPhone)

Готово к установке как приложение (PWA), работает **оффлайн** на Android (Chrome/Edge) и iOS (Safari).

## Как применить изменения через Pull Request
1. Скачайте ZIP и распакуйте файлы поверх репозитория **Podrabotki-Test** в **новую ветку**.
2. Нажмите **Compare & pull request** → создайте PR → **Merge**.
3. Включите GitHub Pages: *Settings → Pages* → Deploy from a branch → Branch: `main` → Folder: `/root`.
4. Откройте: `https://<ваш_логин>.github.io/Podrabotki-Test/`

## Локальный запуск (для проверки SW)
**Windows**
```
install_and_run.bat
```
Откройте http://localhost:8000

**macOS/Linux**
```bash
chmod +x install_and_run.sh
./install_and_run.sh
```
Откройте http://localhost:8000

## Установка на устройство
- **Android (Chrome/Edge):** меню → «Добавить на главный экран» или кнопка «⬇️ Установить».
- **iPhone/iPad (Safari):** «Поделиться → На экран Домой».

## Обновления и кэш
- Кнопка **«🔄 Обновить»** в шапке снимает регистрацию SW, очищает кэш и перезагружает страницу.
- Kill-switch вручную: добавьте `?kill-sw` к адресу страницы.

## Структура
```
/index.html
/manifest.webmanifest
/sw.js
/icons/icon-192.png
/icons/icon-512.png
/install_and_run.bat
/install_and_run.sh
```
