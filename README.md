#JSTRUC
##/QA
### What is it?
Jstruc is an embryo of a javascript in browser game engine. It currently supports delta time, basic shapes and basic collisions (aabb collisions, don't hit the corners).
### Is it really a game engine, though?
Not really, the code on this repos is a code of a "whole" pong. I was too lazy to make it modular but a competent programmer should be able to make the difference between the game and the engine itself.
### What's this server.js thingy?
It's a basic gameserver, this whole repos was a test for me to try and succeed (don't look at the bugs though) making a realtime gameserver in the browser using node.js, express and socket.io. 

### How can I test this?
Currently, you can clone the repo, and launch npm install . within. It should install all the dependencies for you. You should also modify the ip address in the beginning of script.js to yours (local address if you're testing in local).

##TODO
1. Center score;
2. red lines for the goals;
3. aabb segment intersection for precise collisions;
4. refactor client server architecture;
5. tweak the player speed;
6. divide diagonal speed;
7. ???;
8. profit.
