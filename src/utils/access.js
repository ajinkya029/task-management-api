const Board = require("../models/Board");

async function getBoardAccess(boardId, userId) {
  return Board.findOne({
    _id: boardId,
    $or: [{ owner: userId }, { members: userId }]
  });
}

function isOwner(board, userId) {
  return String(board.owner) === String(userId);
}

module.exports = { getBoardAccess, isOwner };