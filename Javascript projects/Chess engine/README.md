This is an attempt of beating my friend at chess who is a lot better than me. Since my ability to play chess is not as good as their's, I still wanted to challenge them. Therefore my only option was to utilise my knowledge of coding to evaluate many more positions than they can. It turned out to be way more challenging than I thought, however I learned a lot during studying for this project. I ended up including the following techniques:

1. Self-made movegenerator that achieves around 370 kN/s (kilo nodes per second)
2. Negamax with iterative deepening and alpha-beta pruning
3. Quiescence search with delta pruning
4. Transposition table with zobrist hashing to store already evaluated positions and remember positions for threefold repetition
5. Late-move-reductions and search extensions
6. Aspiration windows
7. History heuristic for quiet move ordering
8. Killer moves for move ordering
9. Null-move pruning
10. Principal variations search
11. Razoring and deep razoring
12. Futility- and reverse futility pruning
13. Self made evaluation function that takes into account:
    1. Material
    2. Piece positioning (different for middle and endgames)
    3. King safety with not castling penalty, pawn shield and king mobility
    4. Doubled, isolated and passed pawn detection
    5. Rook open file bonus

I estimate my bot to be 1600-1800 elo. It is good at recognizing tactics, however lacks knowledge in positional play. At the moment I usually lose to it due to a tactical oversight on my part. I cannot really win against it anymore and draw very rarely.

In the beginning I wanted to use this project to learn Javascript while making a fun project, however I found out that it probably would've been better to make this project in for example C# or Scala (from the languages I know). This would've allowed me to use unsigned 64-bit numbers for representing the board. This would've allowed me to use bit operations for move creation, which would've made my engine way faster. That being said, I'm satisfied with my learning outcome from this project and overall I managed to make a pretty compenent bot using an unusual programming language for this type of project.

Here are some pictures from the project:
![image](https://github.com/naapeli/Aatu-Selkee-coding-projects/assets/130310206/60d64af9-78b2-40db-be9e-3967bcc40826)
![image](https://github.com/naapeli/Aatu-Selkee-coding-projects/assets/130310206/5ce5f4ab-7473-4a6a-b1ff-bdd4c48c5086)
