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
python3 -m http.server 8000
```
Откройте http://localhost:8000

## Установка на устройство
- **Android (Chrome/Edge):** меню → «Добавить на главный экран».
- **iPhone/iPad (Safari):** «Поделиться → На экран Домой».

## Обновления и кэш
Service Worker всегда запрашивает свежую версию `index.html` по сети и показывает кэш только офлайн, поэтому изменения страницы подхватываются автоматически при следующей загрузке — вручную сбрасывать кэш не требуется. Если нужно принудительно очистить кэш при отладке, сделайте это через DevTools → Application → Service Workers / Clear storage.

## Структура
```
/index.html
/manifest.webmanifest
/sw.js
/icons/icon-192.png
/icons/icon-512.png
/install_and_run.bat
```
