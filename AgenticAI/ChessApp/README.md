# Chess Web Application

This project is a web application for playing chess using the Flask framework and the python-chess library.

## Setup

To run this application, make sure you have Python installed. You can install the required dependencies using the following command:

```bash
pip install -r requirements.txt
```

## Running the Application

To start the application, run:

```bash
python run.py
```

Visit `http://localhost:5000/` in your web browser to play the game.

## Features
- Single page application playable offline
- Human vs Computer gameplay
- Select to play as White or Black
- Timer for each turn
- Score tracking

## API Endpoints
- **GET /api/board/init-reset**: Initializes a new chess board.
- **POST /api/board/validate-move**: Validates a move.
- **POST /api/board/make-move**: Makes a move on the board.
- **POST /api/board/is_checkmate**: Checks if the current position is checkmate.
