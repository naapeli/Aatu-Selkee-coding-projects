# JavaScript Chess Engine

This project was my attempt to challenge a highly skilled friend at chess. Recognizing my limitations in chess skills, I aimed to leverage my coding knowledge to create an engine capable of evaluating many more positions than a human could. Despite the challenges, I gained invaluable experience and learned a lot during this project.

## Key techniques implemented
### Move generation
- Self-made movegenerator that achieves around 370 kN/s (kilo nodes per second)
### Search algorithms:
- Negamax with iterative deepening and alpha-beta pruning
- Quiescence search with delta pruning
- Late-move-reductions and search extensions
- Aspiration windows
- Null-move pruning
- Principal variations search
- Razoring and deep razoring
- Futility- and reverse futility pruning
### Move ordering
- History heuristic for quiet move ordering
- Killer moves for move ordering
### Transposition table
- Transposition table with zobrist hashing to store already evaluated positions and remember positions for threefold repetition
### Evaluation function
- Material balance
- Piece positioning (different for middle and endgames)
- King safety with not castling penalty, pawn shield and king mobility
- Doubled, isolated and passed pawns
- Rook open file bonus

## Performance and insights
I estimate the bot's strength to be around 1600-1800 Elo. It excels at tactical recognition but is still developing in positional play. Currently, I often lose due to tactical oversights, and drawing is rare.

Initially, I intended to use this project to learn JavaScript while creating a fun project. However, I realized that using a language like C# or Scala might have been more suitable for this type of project. Bit operations for move creation using unsigned 64-bit numbers could have significantly improved performance. Nonetheless, I’m satisfied with the learning outcomes and the competence of the engine I developed using JavaScript.


## Project images:
![image](https://github.com/naapeli/Aatu-Selkee-coding-projects/assets/130310206/60d64af9-78b2-40db-be9e-3967bcc40826)
![image](https://github.com/naapeli/Aatu-Selkee-coding-projects/assets/130310206/5ce5f4ab-7473-4a6a-b1ff-bdd4c48c5086)
