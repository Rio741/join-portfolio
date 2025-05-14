# Join Backend

Dieses Projekt ist das Backend für das **Join Kanbanboard**, entwickelt mit Django und Django REST Framework.

## 🚀 Features

- **Benutzerverwaltung**: Login/Registrierung von Benutzern
- **Aufgabenerstellung und -verwaltung**: REST-APIs für Tasks
- **Kontakte**: Verwalten von Kontakten

## 🛠 Technologien

- Python
- Django
- Django REST Framework
- SQLite (als Entwicklungsdatenbank)

## 📦 Voraussetzungen

- Python 3.8+
- `pip` (meist mit Python vorinstalliert)
- `git`
- Optional: `venv` oder `pipenv` für virtuelle Umgebungen

## ⚙️ Installation
1. Repository klonen:
   ```bash
   git clone https://github.com/Rio741/join-portfolio.git
   cd join-backend
2. Virtuelle Umgebung erstellen und aktivieren:
   ```bash
   python -m venv venv
   venv\Scripts\activate 
3. Abhängigkeiten installieren:
   ```bash
   pip install -r requirements.txt
4. Datenbankmigrationen anwenden:
   ```bash
   python manage.py migrate
5. Entwicklungsserver starten:
   ```bash
   python manage.py runserver