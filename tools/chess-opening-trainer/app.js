(function () {
  'use strict';

  var STORE = SiteProgress.tool('chess-opening-trainer');

  function resolveInitialLang() {
    try {
      var q = new URLSearchParams(window.location.search).get('lang');
      if (q === 'es' || q === 'en') return q;
    } catch (_) {}
    var saved = STORE.get('lang', null);
    if (saved === 'es' || saved === 'en') return saved;
    try {
      var global = localStorage.getItem('todologo.lang');
      if (global === 'es' || global === 'en') return global;
    } catch (_) {}
    return 'es';
  }

  var LANG = resolveInitialLang();
  var CLEAN = false;

  /* =====================================================================
   * LEGAL CHESS ENGINE (8x8 board, full FIDE castling, en passant, SAN)
   * ===================================================================== */
  var FILES = 'abcdefgh';

  function sqToRC(sq) {
    return [8 - Number(sq[1]), FILES.indexOf(sq[0])];
  }
  function rcToSq(r, c) {
    return FILES[c] + String(8 - r);
  }
  function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }

  function createInitialState() {
    var b = Array.from({ length: 8 }, function () { return Array(8).fill(null); });
    var back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    for (var c = 0; c < 8; c++) {
      b[0][c] = 'b' + back[c];
      b[1][c] = 'bP';
      b[6][c] = 'wP';
      b[7][c] = 'w' + back[c];
    }
    return {
      board: b,
      turn: 'w',
      castling: { wK: true, wQ: true, bK: true, bQ: true },
      ep: null,
      lastMove: null
    };
  }

  function cloneState(st) {
    var cr = st.castling || { wK: true, wQ: true, bK: true, bQ: true };
    return {
      board: st.board.map(function (row) { return row.slice(); }),
      turn: st.turn,
      castling: { wK: !!cr.wK, wQ: !!cr.wQ, bK: !!cr.bK, bQ: !!cr.bQ },
      ep: st.ep ? [st.ep[0], st.ep[1]] : null,
      lastMove: st.lastMove ? { from: st.lastMove.from, to: st.lastMove.to } : null
    };
  }

  function isSquareAttacked(board, tr, tc, byColor) {
    var oppPawnRow = byColor === 'w' ? tr + 1 : tr - 1;
    if (inBounds(oppPawnRow, tc - 1) && board[oppPawnRow][tc - 1] === byColor + 'P') return true;
    if (inBounds(oppPawnRow, tc + 1) && board[oppPawnRow][tc + 1] === byColor + 'P') return true;

    var kn = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (var i = 0; i < kn.length; i++) {
      var nr = tr + kn[i][0], nc = tc + kn[i][1];
      if (inBounds(nr, nc) && board[nr][nc] === byColor + 'N') return true;
    }

    var diag = [[-1,-1],[-1,1],[1,-1],[1,1]];
    for (var d = 0; d < diag.length; d++) {
      var rr = tr + diag[d][0], cc = tc + diag[d][1];
      if (inBounds(rr, cc) && board[rr][cc] === byColor + 'K') return true;
      while (inBounds(rr, cc)) {
        var p = board[rr][cc];
        if (p) {
          if (p[0] === byColor && (p[1] === 'B' || p[1] === 'Q')) return true;
          break;
        }
        rr += diag[d][0]; cc += diag[d][1];
      }
    }

    var ortho = [[-1,0],[1,0],[0,-1],[0,1]];
    for (var o = 0; o < ortho.length; o++) {
      var r2 = tr + ortho[o][0], c2 = tc + ortho[o][1];
      if (inBounds(r2, c2) && board[r2][c2] === byColor + 'K') return true;
      while (inBounds(r2, c2)) {
        var p2 = board[r2][c2];
        if (p2) {
          if (p2[0] === byColor && (p2[1] === 'R' || p2[1] === 'Q')) return true;
          break;
        }
        r2 += ortho[o][0]; c2 += ortho[o][1];
      }
    }
    return false;
  }

  function findKing(board, color) {
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        if (board[r][c] === color + 'K') return [r, c];
      }
    }
    return null;
  }

  function inCheck(st, color) {
    var col = color || st.turn;
    var kPos = findKing(st.board, col);
    return !!(kPos && isSquareAttacked(st.board, kPos[0], kPos[1], col === 'w' ? 'b' : 'w'));
  }

  function pseudoMovesFrom(st, fr, fc) {
    var b = st.board;
    var p = b[fr][fc];
    if (!p) return [];
    var col = p[0], kind = p[1], moves = [];
    var dir = col === 'w' ? -1 : 1;

    if (kind === 'P') {
      if (inBounds(fr + dir, fc) && !b[fr + dir][fc]) {
        moves.push([fr + dir, fc]);
        var startRow = col === 'w' ? 6 : 1;
        if (fr === startRow && !b[fr + 2 * dir][fc]) moves.push([fr + 2 * dir, fc]);
      }
      [-1, 1].forEach(function (dc) {
        var nr = fr + dir, nc = fc + dc;
        if (!inBounds(nr, nc)) return;
        if (b[nr][nc] && b[nr][nc][0] !== col) moves.push([nr, nc]);
        else if (st.ep && st.ep[0] === nr && st.ep[1] === nc) moves.push([nr, nc]);
      });
      return moves;
    }

    if (kind === 'N') {
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(function (d) {
        var nr = fr + d[0], nc = fc + d[1];
        if (inBounds(nr, nc) && (!b[nr][nc] || b[nr][nc][0] !== col)) moves.push([nr, nc]);
      });
      return moves;
    }

    if (kind === 'K') {
      for (var dr = -1; dr <= 1; dr++) {
        for (var dc2 = -1; dc2 <= 1; dc2++) {
          if (!dr && !dc2) continue;
          var kr = fr + dr, kc = fc + dc2;
          if (inBounds(kr, kc) && (!b[kr][kc] || b[kr][kc][0] !== col)) moves.push([kr, kc]);
        }
      }
      var homeRow = col === 'w' ? 7 : 0;
      var cr = st.castling || { wK: true, wQ: true, bK: true, bQ: true };
      var allowK = col === 'w' ? cr.wK : cr.bK;
      var allowQ = col === 'w' ? cr.wQ : cr.bQ;
      if (fr === homeRow && fc === 4) {
        if (allowK && b[homeRow][7] === col + 'R' && !b[homeRow][5] && !b[homeRow][6]) moves.push([homeRow, 6]);
        if (allowQ && b[homeRow][0] === col + 'R' && !b[homeRow][1] && !b[homeRow][2] && !b[homeRow][3]) moves.push([homeRow, 2]);
      }
      return moves;
    }

    var rays = [];
    if (kind === 'B' || kind === 'Q') rays = rays.concat([[-1,-1],[-1,1],[1,-1],[1,1]]);
    if (kind === 'R' || kind === 'Q') rays = rays.concat([[-1,0],[1,0],[0,-1],[0,1]]);
    rays.forEach(function (ry) {
      var rr = fr + ry[0], cc = fc + ry[1];
      while (inBounds(rr, cc)) {
        if (!b[rr][cc]) {
          moves.push([rr, cc]);
        } else {
          if (b[rr][cc][0] !== col) moves.push([rr, cc]);
          break;
        }
        rr += ry[0]; cc += ry[1];
      }
    });
    return moves;
  }

  function applyRaw(st, fr, fc, tr, tc, promo) {
    var next = cloneState(st);
    var p = next.board[fr][fc];
    var captured = next.board[tr][tc];
    // En passant capture removes adjacent pawn
    if (p && p[1] === 'P' && fc !== tc && !captured) {
      next.board[fr][tc] = null;
    }
    next.board[fr][fc] = null;
    next.board[tr][tc] = p;
    // Handle castling rook shift
    if (p && p[1] === 'K' && fc === 4 && tc === 6) {
      next.board[tr][5] = next.board[tr][7];
      next.board[tr][7] = null;
    } else if (p && p[1] === 'K' && fc === 4 && tc === 2) {
      next.board[tr][3] = next.board[tr][0];
      next.board[tr][0] = null;
    }
    // Update castling rights on King/Rook moves or Rook capture
    if (p === 'wK') { next.castling.wK = false; next.castling.wQ = false; }
    if (p === 'bK') { next.castling.bK = false; next.castling.bQ = false; }
    if ((fr === 7 && fc === 7) || (tr === 7 && tc === 7)) next.castling.wK = false;
    if ((fr === 7 && fc === 0) || (tr === 7 && tc === 0)) next.castling.wQ = false;
    if ((fr === 0 && fc === 7) || (tr === 0 && tc === 7)) next.castling.bK = false;
    if ((fr === 0 && fc === 0) || (tr === 0 && tc === 0)) next.castling.bQ = false;
    // Update en passant square
    if (p && p[1] === 'P' && Math.abs(tr - fr) === 2) {
      next.ep = [(fr + tr) / 2, fc];
    } else {
      next.ep = null;
    }
    // Pawn promotion
    var pk = promo ? promo.toUpperCase() : 'Q';
    if (p === 'wP' && tr === 0) next.board[tr][tc] = 'w' + pk;
    if (p === 'bP' && tr === 7) next.board[tr][tc] = 'b' + pk;
    next.turn = st.turn === 'w' ? 'b' : 'w';
    next.lastMove = { from: rcToSq(fr, fc), to: rcToSq(tr, tc) };
    return next;
  }

  function getLegalTargets(st, fromSq) {
    var rc = sqToRC(fromSq);
    var p = st.board[rc[0]][rc[1]];
    if (!p || p[0] !== st.turn) return [];
    var col = p[0], opp = col === 'w' ? 'b' : 'w';
    var pseudo = pseudoMovesFrom(st, rc[0], rc[1]);
    var legal = [];
    pseudo.forEach(function (dest) {
      var tr = dest[0], tc = dest[1];
      if (p[1] === 'K' && rc[1] === 4 && Math.abs(tc - 4) === 2) {
        if (isSquareAttacked(st.board, rc[0], 4, opp)) return;
        var passC = tc === 6 ? 5 : 3;
        if (isSquareAttacked(st.board, rc[0], passC, opp)) return;
      }
      var ns = applyRaw(st, rc[0], rc[1], tr, tc);
      var kPos = findKing(ns.board, col);
      if (kPos && !isSquareAttacked(ns.board, kPos[0], kPos[1], opp)) {
        legal.push(rcToSq(tr, tc));
      }
    });
    return legal;
  }

  function allLegalMoves(st) {
    var list = [];
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var p = st.board[r][c];
        if (!p || p[0] !== st.turn) continue;
        var fromSq = rcToSq(r, c);
        var targets = getLegalTargets(st, fromSq);
        for (var i = 0; i < targets.length; i++) {
          list.push(fromSq + targets[i]);
        }
      }
    }
    return list;
  }

  function applyUciMove(st, uci) {
    var fromSq = uci.slice(0, 2), toSq = uci.slice(2, 4);
    var legal = getLegalTargets(st, fromSq);
    if (legal.indexOf(toSq) === -1) {
      throw new Error('Illegal UCI move "' + uci + '" for turn ' + st.turn);
    }
    var frc = sqToRC(fromSq), trc = sqToRC(toSq);
    return applyRaw(st, frc[0], frc[1], trc[0], trc[1], uci[4] || null);
  }

  function boardAfterPlies(opening, plyCount) {
    var st = createInitialState();
    for (var i = 0; i < plyCount && i < opening.moves.length; i++) {
      st = applyUciMove(st, opening.moves[i].uci);
    }
    return st;
  }

  function moveToSan(st, uci, lang) {
    var fromSq = uci.slice(0, 2), toSq = uci.slice(2, 4);
    var frc = sqToRC(fromSq), trc = sqToRC(toSq);
    var p = st.board[frc[0]][frc[1]];
    if (!p) return toSq;
    var kind = p[1], col = p[0];
    var useLang = lang || LANG;
    var esMap = { N: 'C', B: 'A', R: 'T', Q: 'D', K: 'R' };
    var enMap = { N: 'N', B: 'B', R: 'R', Q: 'Q', K: 'K' };
    var pMap = useLang === 'en' ? enMap : esMap;
    var san = '';
    if (kind === 'K' && frc[1] === 4 && trc[1] === 6) {
      san = 'O-O';
    } else if (kind === 'K' && frc[1] === 4 && trc[1] === 2) {
      san = 'O-O-O';
    } else {
      var cap = !!(st.board[trc[0]][trc[1]] || (kind === 'P' && frc[1] !== trc[1]));
      if (kind === 'P') {
        san = (cap ? fromSq[0] + 'x' : '') + toSq;
        if ((col === 'w' && trc[0] === 0) || (col === 'b' && trc[0] === 7)) {
          san += '=' + (pMap[(uci[4] || 'Q').toUpperCase()] || 'Q');
        }
      } else {
        var sameFile = false, sameRank = false, ambig = false;
        if (kind !== 'K') {
          for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
              if ((r !== frc[0] || c !== frc[1]) && st.board[r][c] === p) {
                var oTargets = getLegalTargets(st, rcToSq(r, c));
                if (oTargets.indexOf(toSq) !== -1) {
                  ambig = true;
                  if (c === frc[1]) sameFile = true;
                  if (r === frc[0]) sameRank = true;
                }
              }
            }
          }
        }
        var dis = '';
        if (ambig) {
          if (!sameFile) dis = fromSq[0];
          else if (!sameRank) dis = fromSq[1];
          else dis = fromSq;
        }
        san = (pMap[kind] || '') + dis + (cap ? 'x' : '') + toSq;
      }
    }
    var ns = applyRaw(st, frc[0], frc[1], trc[0], trc[1], uci[4] || null);
    if (inCheck(ns, ns.turn)) {
      san += allLegalMoves(ns).length === 0 ? '#' : '+';
    }
    return san;
  }

  function uciToSimpleSan(st, uci) {
    return moveToSan(st, uci, LANG);
  }

  /* =====================================================================
   * CRISP HIGH-CONTRAST STAUNTON VECTOR CHESS PIECES SVG
   * ===================================================================== */
  function buildPieceSVG(code) {
    var isW = code[0] === 'w';
    var kind = code[1];
    var fill = isW ? '#ffffff' : '#0b0f14';
    var stroke = '#0b0f14';
    var accent = isW ? '#0b0f14' : '#ffffff';
    var g = '';

    if (kind === 'P') {
      g = '<path d="M22.5 9 C20.3 9 18.5 10.8 18.5 13 C18.5 14.3 19.1 15.5 20.1 16.2 C17.9 17.5 16.5 19.9 16.5 22.6 C16.5 24.4 17.2 26 18.3 27.2 L14.5 34.5 H30.5 L26.7 27.2 C27.8 26 28.5 24.4 28.5 22.6 C28.5 19.9 27.1 17.5 24.9 16.2 C25.9 15.5 26.5 14.3 26.5 13 C26.5 10.8 24.7 9 22.5 9 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M13 36.5 H32 C32.8 36.5 33.4 35.8 33.4 35 C33.4 34.1 32.8 33.5 32 33.5 H13 C12.2 33.5 11.6 34.1 11.6 35 C11.6 35.8 12.2 36.5 13 36.5 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.8" stroke-linejoin="round"/>';
    } else if (kind === 'R') {
      g = '<path d="M11 36.5 H34 V33.5 H11 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.7" stroke-linejoin="round"/>' +
        '<path d="M12.5 33.5 L14.5 29.8 H30.5 L32.5 33.5 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.7" stroke-linejoin="round"/>' +
        '<path d="M15.5 29.8 V17.5 H29.5 V29.8 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.7" stroke-linejoin="round"/>' +
        '<path d="M12.5 17.5 L15.5 20 H29.5 L32.5 17.5 V10 H28 V13.5 H24.8 V10 H20.2 V13.5 H17 V10 H12.5 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.7" stroke-linejoin="round"/>' +
        (isW ? '' : '<path d="M14 31.8 H31 M14.8 16.2 H30.2 M16 29 H29" stroke="' + accent + '" stroke-width="1.15" stroke-linecap="round"/>');
    } else if (kind === 'N') {
      g = '<path d="M22 10 C32.5 11 38.5 18 38 35.5 H15 C15 26.5 25 29 23 19.5" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M24 18 C24.4 20.9 18.4 25.4 16 26 C13 28 13.2 30.3 11 30.3 C10 29.4 12.4 27.3 11 27.3 C10 27.3 11.2 28.5 10 29.3 C9 29.3 6 30.3 6 25.3 C6 23.3 12 13.3 12 13.3 C12 13.3 13.9 11.4 14 9.8 C13.3 8.9 13.5 7.8 13.5 6.8 C14.5 5.8 16.5 9.3 16.5 9.3 H18.5 C18.5 9.3 19.3 7.3 21 6.3 C22 6.3 22 9.3 22 9.3" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="15" cy="14.8" r="1.1" fill="' + accent + '"/>' +
        '<circle cx="9.2" cy="25.2" r="0.85" fill="' + accent + '"/>' +
        '<rect x="11.5" y="34.5" width="27" height="3" rx="1.2" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.6"/>' +
        (isW ? '' : '<path d="M25.5 11.8 C33 13.5 36.2 21.5 36 33" fill="none" stroke="' + accent + '" stroke-width="1.2" stroke-linecap="round"/>');
    } else if (kind === 'B') {
      g = '<path d="M9 36 C12.4 35 19.1 36.4 22.5 34 C25.9 36.4 32.6 35 36 36 C36 36 37.6 36.5 39 38 C38.3 39 37.4 39 36 38.5 C32.6 37.5 25.9 39 22.5 37.5 C19.1 39 12.4 37.5 9 38.5 C7.6 39 6.7 39 6 38 C7.4 36.7 9 36 9 36 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M15 32 C17.5 34.5 27.5 34.5 30 32 C30.5 30.5 30 30 30 30 C30 27.5 27.5 26 27.5 26 C33 24.5 33.5 14.5 22.5 10.5 C11.5 14.5 12 24.5 17.5 26 C17.5 26 15 27.5 15 30 C15 30 14.5 30.5 15 32 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.7" stroke-linejoin="round"/>' +
        '<circle cx="22.5" cy="7.6" r="2.6" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.6"/>' +
        '<path d="M22.5 15.5 V20.8 M19.8 18.2 H25.2" stroke="' + accent + '" stroke-width="1.65" stroke-linecap="round"/>' +
        '<path d="M17.5 26 H27.5 M15.4 29.8 H29.6" stroke="' + accent + '" stroke-width="1.2" stroke-linecap="round"/>';
    } else if (kind === 'Q') {
      g = '<circle cx="6.5" cy="12" r="2.1" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4"/>' +
        '<circle cx="14" cy="9.2" r="2.1" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4"/>' +
        '<circle cx="22.5" cy="8" r="2.2" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4"/>' +
        '<circle cx="31" cy="9.2" r="2.1" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4"/>' +
        '<circle cx="38.5" cy="12" r="2.1" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.4"/>' +
        '<path d="M9 26.5 C17.5 25 29.5 25 36 26.5 L38 14.2 L30.8 25 L29.8 11.4 L24.8 24.4 L22.5 10.2 L20.2 24.4 L15.2 11.4 L14.2 25 L7 14.2 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M9 26.5 C9 28.5 10.5 28.5 11.5 30.5 C12.5 32 12.5 31.5 12 34 C10.5 35 10.5 36.5 10.5 36.5 C9 38 11.5 38.5 11.5 38.5 C18 39.5 27 39.5 33.5 38.5 C33.5 38.5 35 37.5 33.5 36.5 C33.5 36.5 34 35 32.5 34 C32 31.5 32 32 33 30.5 C34 28.5 35.5 28.5 36 26.5 C27.5 25 17.5 25 9 26.5 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M12 31.5 Q22.5 30 33 31.5 M12.5 34.8 Q22.5 33.3 32.5 34.8" fill="none" stroke="' + accent + '" stroke-width="1.25" stroke-linecap="round"/>';
    } else if (kind === 'K') {
      g = '<path d="M22.5 11.6 V6 M20 8 H25" stroke="' + stroke + '" stroke-width="2.1" stroke-linecap="round"/>' +
        (isW ? '' : '<path d="M22.5 11 V6.5 M20.4 8 H24.6" stroke="#ffffff" stroke-width="0.9" stroke-linecap="round"/>') +
        '<path d="M22.5 25 C22.5 25 27 17.5 25.5 14.5 C25.5 14.5 24.5 12 22.5 12 C20.5 12 19.5 14.5 19.5 14.5 C18 17.5 22.5 25 22.5 25 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.6"/>' +
        '<path d="M12.5 36.8 C18 39.8 27 39.8 32.5 36.8 L32.5 29.8 C32.5 29.8 41.5 25.3 38.5 19.3 C34.5 12.8 25 15.8 22.5 23.3 L22.5 26.8 L22.5 23.3 C20 15.8 10.5 12.8 6.5 19.3 C3.5 25.3 12.5 29.8 12.5 29.8 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.7" stroke-linejoin="round"/>' +
        '<path d="M12.5 30 Q22.5 27 32.5 30 M12.5 33.5 Q22.5 30.5 32.5 33.5 M12.5 36.8 Q22.5 33.8 32.5 36.8" fill="none" stroke="' + accent + '" stroke-width="1.25" stroke-linecap="round"/>';
    }

    return '<svg class="piece-svg" viewBox="0 0 45 43" aria-hidden="true">' + g + '</svg>';
  }

  /* =====================================================================
   * 12 CHESS OPENINGS REPERTOIRE (Verified Legal Plies + Traps)
   * ===================================================================== */
  var BLOCKS = [
    { id: 'all',           es: 'Repertorio completo',     en: 'Full repertoire',          match: function () { return true; } },
    { id: 'abiertas',      es: 'Abiertas (1.e4 e5)',      en: 'Open Games (1.e4 e5)',     match: function (o) { return o.block === 'abiertas'; } },
    { id: 'semiabiertas',  es: 'Semiabiertas vs 1.e4',    en: 'Semi-Open vs 1.e4',        match: function (o) { return o.block === 'semiabiertas'; } },
    { id: 'cerradas',      es: 'Gambito Dama y 1.d4',     en: 'Queen’s Gambit & 1.d4',    match: function (o) { return o.block === 'cerradas'; } },
    { id: 'hipermodernas', es: 'Indias e Hipermodernas',  en: 'Indian & Hypermodern',     match: function (o) { return o.block === 'hipermodernas'; } }
  ];

  var OPENINGS = [
    {
      id: 'italiana', block: 'abiertas', eco: 'C50', side: 'w',
      es: 'Apertura Italiana', en: 'Italian Game',
      keySquares: ['e4', 'd4', 'f7'],
      ideaEs: 'Apunta el alfil a c4 sobre la debilidad natural f7, construye el centro ideal con c3+d4 y enroca rápido.',
      ideaEn: 'Aims the bishop at the vulnerable f7 square via c4, builds a classic c3+d4 center, and castles swiftly.',
      structEs: 'Peones centrales e4 + c3 preparando d4; alfil español/italiano en diagonal a2–g8.',
      structEn: 'Central pawns on e4 + c3 preparing d4; bishop slicing along the a2–g8 diagonal.',
      badPlansEs: [
        'Encerrar tu propio alfil de c1 con d3 y e3 pasivos dejando f7 sin presión.',
        'Atacar el flanco de dama con a4-b5 sin desarrollar los caballos ni enrocar.'
      ],
      badPlansEn: [
        'Lock your dark-squared bishop inside behind passive d3/e3 pawns with zero f7 pressure.',
        'Launch premature queenside pawn storms with a4-b5 before developing pieces and castling.'
      ],
      trap: {
        ply: 5,
        blunderUci: 'c6d4', blunderSanEs: '3...Cd4?!', blunderSanEn: '3...Nd4?!',
        refuteUci: 'f3d4', refuteSanEs: '4.Cxd4!', refuteSanEn: '4.Nxd4!',
        trapEs: 'El gambito Blackburne (3...Cd4?!) intenta tentar 4.Cxe5?? Dg5!; cambiando primero con 4.Cxd4! exd4 el blanco conserva enorme ventaja de desarrollo.',
        trapEn: 'Blackburne Shilling bait (3...Nd4?!) hopes for 4.Nxe5?? Qg5!; calmly trading 4.Nxd4! exd4 keeps a clean development lead.'
      },
      moves: [
        { uci: 'e2e4', sanEs: '1.e4', sanEn: '1.e4', whyEs: 'Reclama el centro y abre diagonales de Dama y Alfil f1.', whyEn: 'Claims the center and frees Queen and light-squared Bishop.' },
        { uci: 'e7e5', sanEs: '1...e5', sanEn: '1...e5', whyEs: 'Disputa el centro simétricamente evitando la expansión d4 gratis.', whyEn: 'Contests the center head-on, preventing an unopposed d4 march.' },
        { uci: 'g1f3', sanEs: '2.Cf3', sanEn: '2.Nf3', whyEs: 'Desarrolla el caballo al centro atacando e5 al instante.', whyEn: 'Develops knight toward the center while immediately attacking e5.' },
        { uci: 'b8c6', sanEs: '2...Cc6', sanEn: '2...Nc6', whyEs: 'Defiende e5 desarrollando una pieza y vigilando d4.', whyEn: 'Defends e5 cleanly with natural development.' },
        { uci: 'f1c4', sanEs: '3.Ac4', sanEn: '3.Bc4', whyEs: 'Clásico sello italiano: fija f7, el punto más débil negro antes de enrocar.', whyEn: 'Signature Italian move: targets f7, Black’s weakest early square.' },
        { uci: 'f8c5', sanEs: '3...Ac5', sanEn: '3...Bc5', whyEs: 'Responde activamente apuntando sobre d4 y f2 (Giuoco Piano).', whyEn: 'Mirrors activity onto d4 and f2 (Giuoco Piano).' },
        { uci: 'c2c3', sanEs: '4.c3', sanEn: '4.c3', whyEs: 'Prepara d4 sólido para construir un dúo central de peones.', whyEn: 'Supports a solid d4 push to erect a broad central pawn duo.' },
        { uci: 'g8f6', sanEs: '4...Cf6', sanEn: '4...Nf6', whyEs: 'Contraataca el peón de e4 antes de que el blanco tome todo el centro.', whyEn: 'Counterattacks e4 before White locks in total central dominance.' },
        { uci: 'd2d3', sanEs: '5.d3', sanEn: '5.d3', whyEs: 'Sostiene e4 con firmeza (Giuoco Pianissimo) y abre paso al alfil c1.', whyEn: 'Cements e4 (Giuoco Pianissimo) and clears the dark-squared bishop.' },
        { uci: 'd7d6', sanEs: '5...d6', sanEn: '5...d6', whyEs: 'Refuerza e5 y habilita el alfil c8 para completar el desarrollo.', whyEn: 'Reinforces e5 and unlocks c8 bishop development.' },
        { uci: 'e1g1', sanEs: '6.O-O', sanEn: '6.O-O', whyEs: 'Resguarda al Rey y activa la torre hacia el centro (Te1).', whyEn: 'Tucks the King into safety and prepares rook centralization.' },
        { uci: 'a7a6', sanEs: '6...a6', sanEn: '6...a6', whyEs: 'Reserva la casilla a7 para el alfil negro evitando cambios tras Ca4/Ae3.', whyEn: 'Creates an a7 retreat square for the c5 bishop against Na4/Be3.' }
      ]
    },
    {
      id: 'espanola', block: 'abiertas', eco: 'C65', side: 'w',
      es: 'Apertura Española (Ruy López)', en: 'Ruy Lopez (Spanish)',
      keySquares: ['e5', 'b5', 'c3'],
      ideaEs: 'Presiona indirectamente el centro e5 amenazando su defensor natural Cc6 y planifica c3+d4 tras enrocar.',
      ideaEn: 'Applies long-term pressure against the e5 center by targeting its knight defender and preparing c3+d4.',
      structEs: 'Peón blanco en e4 + c3 y alfil en la diagonal a2–g8 tras a4/Ab3.',
      structEn: 'Pawn chain e4 + c3 with the Spanish bishop tucked safely on the a2–g8 diagonal.',
      badPlansEs: [
        'Cambiar el alfil de b5 en c6 sin motivo concreto regalando la pareja de alfiles.',
        'Avanzar f4 en la jugada 3 exponiendo la diagonal del Rey sin enrocar.'
      ],
      badPlansEn: [
        'Trading Bxc6 unprovoked right away, surrendering the bishop pair.',
        'Pushing f4 recklessly on move 3 while the King remains uncastled in the center.'
      ],
      trap: {
        ply: 9,
        blunderUci: 'f6e4', blunderSanEs: '5...Cxe4?!', blunderSanEn: '5...Nxe4?!',
        refuteUci: 'd2d4', refuteSanEs: '6.d4!', refuteSanEn: '6.d4!',
        trapEs: 'Comer e4 con 5...Cxe4 tras 5.O-O abre la columna central “e” frente al Rey negro sin enrocar: 6.d4! y Te1 devuelven el peón con ataque brutal.',
        trapEn: 'Snatching e4 right after 5.O-O opens the e-file while Black’s King lingers in the center: 6.d4! + Re1 win the initiative decisively.'
      },
      moves: [
        { uci: 'e2e4', sanEs: '1.e4', sanEn: '1.e4', whyEs: 'Inicia abriendo juego central y líneas para piezas ligeras.', whyEn: 'Seizes central space and opens lines for rapid development.' },
        { uci: 'e7e5', sanEs: '1...e5', sanEn: '1...e5', whyEs: 'Iguala espacio en el centro.', whyEn: 'Matches central space directly.' },
        { uci: 'g1f3', sanEs: '2.Cf3', sanEn: '2.Nf3', whyEs: 'Presiona e5 de forma inmediata.', whyEn: 'Attacks e5 with tempo.' },
        { uci: 'b8c6', sanEs: '2...Cc6', sanEn: '2...Nc6', whyEs: 'Defiende e5 con pieza menor.', whyEn: 'Natural defense of e5.' },
        { uci: 'f1b5', sanEs: '3.Ab5', sanEn: '3.Bb5', whyEs: 'Sello de Ruy López: ataca al defensor de e5 generando tensión prolongada.', whyEn: 'Ruy Lopez signature: pressures e5 indirectly via its c6 defender.' },
        { uci: 'a7a6', sanEs: '3...a6', sanEn: '3...a6', whyEs: 'Defensa Morphy: pregunta al alfil su intención ganando espacio en el flanco.', whyEn: 'Morphy Defense: forces the bishop to declare its plan.' },
        { uci: 'b5a4', sanEs: '4.Aa4', sanEn: '4.Ba4', whyEs: 'Conserva el valioso alfil español apuntando sobre la gran diagonal.', whyEn: 'Preserves the proud Spanish bishop on the a4–e8 diagonal.' },
        { uci: 'g8f6', sanEs: '4...Cf6', sanEn: '4...Nf6', whyEs: 'Contraataca e4 manteniendo la defensa flexible.', whyEn: 'Counterattacks e4 while preparing kingside castling.' },
        { uci: 'e1g1', sanEs: '5.O-O', sanEn: '5.O-O', whyEs: 'Enroca rápido dejando e4 como peón envenenado temporalmente.', whyEn: 'Castles fast, leaving e4 temporarily poisoned against greedy capture.' },
        { uci: 'f8e7', sanEs: '5...Ae7', sanEn: '5...Be7', whyEs: 'Defensa sólida (variante cerrada): bloquea clavadas y prepara O-O.', whyEn: 'Solid Closed Ruy setup unpinning e-file before castling.' },
        { uci: 'f1e1', sanEs: '6.Te1', sanEn: '6.Re1', whyEs: 'Sobreprotege e4 y ahora amenaza seriamente Axc6 + Cxe5.', whyEn: 'Overprotects e4 so Bxc6 followed by Nxe5 becomes a real threat.' },
        { uci: 'b7b5', sanEs: '6...b5', sanEn: '6...b5', whyEs: 'Corta la amenaza sobre c6 ganando tiempo antes de O-O.', whyEn: 'Drives the bishop back to break the threat on e5.' }
      ]
    },
    {
      id: 'escocesa', block: 'abiertas', eco: 'C45', side: 'w',
      es: 'Apertura Escocesa', en: 'Scotch Game',
      keySquares: ['d4', 'e5', 'f6'],
      ideaEs: 'Golpea el centro en la jugada 3 con d4 abriendo columnas centrales antes de que las negras consoliden.',
      ideaEn: 'Strikes the center immediately on move 3 with d4 to open central lines before Black consolidates.',
      structEs: 'Blancas con ventaja de espacio central (e4); columnas c y d semiabiertas tras los cambios.',
      structEn: 'White holds central e4 space with open d- and semi-open c-files after central exchanges.',
      badPlansEs: [
        'Cambiar caballos prematuramente en c6 fortaleciendo la cadena central negra con bxc6.',
        'Jugar c4 demasiado rápido en lugar de c3 cediendo huecos en las casillas blancas.'
      ],
      badPlansEn: [
        'Voluntarily playing Nxc6 early, reinforcing Black’s d5 pawn with bxc6.',
        'Pushing c4 early instead of c3, leaving permanent holes on light squares.'
      ],
      trap: {
        ply: 7,
        blunderUci: 'c6d4', blunderSanEs: '4...Cxd4?!', blunderSanEn: '4...Nxd4?!',
        refuteUci: 'd1d4', refuteSanEs: '5.Dxd4!', refuteSanEn: '5.Qxd4!',
        trapEs: 'Cambiar caballos prematuramente con 4...Cxd4 permite 5.Dxd4 centralizando la Dama blanca gratis sin ninguna pieza negra que pueda expulsarla (Cc6 ya desapareció).',
        trapEn: 'Trading knights early via 4...Nxd4 hands White an unassailable centralized Queen on d4 since c6 can no longer kick it away.'
      },
      moves: [
        { uci: 'e2e4', sanEs: '1.e4', sanEn: '1.e4', whyEs: 'Ocupa casilla central clave.', whyEn: 'Occupies key central square.' },
        { uci: 'e7e5', sanEs: '1...e5', sanEn: '1...e5', whyEs: 'Respuesta simétrica en el centro.', whyEn: 'Balanced central reply.' },
        { uci: 'g1f3', sanEs: '2.Cf3', sanEn: '2.Nf3', whyEs: 'Desarrolla atacando e5.', whyEn: 'Develops with attack on e5.' },
        { uci: 'b8c6', sanEs: '2...Cc6', sanEn: '2...Nc6', whyEs: 'Sostiene e5.', whyEn: 'Supports e5.' },
        { uci: 'd2d4', sanEs: '3.d4', sanEn: '3.d4', whyEs: 'Golpe escocés inmediato: fuerza al negro a ceder el centro o quedar apretado.', whyEn: 'Scotch strike: forces Black to surrender the central e5 outpost.' },
        { uci: 'e5d4', sanEs: '3...exd4', sanEn: '3...exd4', whyEs: 'Única captura sana para no quedar pasivo.', whyEn: 'Essential capture to avoid cramped passivity.' },
        { uci: 'f3d4', sanEs: '4.Cxd4', sanEn: '4.Nxd4', whyEs: 'Recaptura centralizando el caballo con buen control.', whyEn: 'Centralizes the knight cleanly with strong board presence.' },
        { uci: 'f8c5', sanEs: '4...Ac5', sanEn: '4...Bc5', whyEs: 'Variante clásica: presiona d4 inmediatamente.', whyEn: 'Classical line attacking the centralized d4 knight right away.' },
        { uci: 'c1e3', sanEs: '5.Ae3', sanEn: '5.Be3', whyEs: 'Defiende d4 desarrollando un alfil en diagonal activa.', whyEn: 'Defends d4 while actively developing the dark-squared bishop.' },
        { uci: 'd8f6', sanEs: '5...Df6', sanEn: '5...Qf6', whyEs: 'Triple ataque sobre d4 amenazando Axd4 y Dxd4.', whyEn: 'Adds a third attacker onto d4.' },
        { uci: 'c2c3', sanEs: '6.c3', sanEn: '6.c3', whyEs: 'Mantiene el puesto avanzado d4 firme e impide cambios forzados.', whyEn: 'Anchors d4 solidly and prevents tactical collapse.' },
        { uci: 'g8e7', sanEs: '6...Cge7', sanEn: '6...Nge7', whyEs: 'Prepara d5 o enroque sin obstruir el f7/f5.', whyEn: 'Prepares castling and d5 break smoothly.' }
      ]
    },
    {
      id: 'siciliana', block: 'semiabiertas', eco: 'B90', side: 'b',
      es: 'Defensa Siciliana (Najdorf)', en: 'Sicilian Defense (Najdorf)',
      keySquares: ['c5', 'd4', 'c4'],
      ideaEs: 'Desequilibrio asimétrico desde el turno 1: cambia el peón lateral c por el central d y ataca por la columna semiabierta c.',
      ideaEn: 'Creates sharp asymmetry from move 1: swaps a wing c-pawn for White’s central d-pawn and pressures the semi-open c-file.',
      structEs: 'Estructura asimétrica con peones centrales extra negros (d6 + e5/e6) vs. ataque blanco en flanco rey.',
      structEn: 'Asymmetric central majority for Black (2 vs 1) with play along the c-file against White’s kingside storm.',
      badPlansEs: [
        'Jugar passively b6/Ab7 sin controlar d5 ni luchar por la columna abierta c.',
        'Permitir enroques opuestos sin lanzar contrajuego en el flanco de dama con b5.'
      ],
      badPlansEn: [
        'Play passively without eyeing d5 control or contesting the open c-file.',
        'Sit idle in opposite-side castling without launching a counterattack via b5 and Rc8.'
      ],
      trap: {
        ply: 9,
        blunderUci: 'e7e5', blunderSanEs: '5...e5?', blunderSanEn: '5...e5?',
        refuteUci: 'f1b5', refuteSanEs: '6.Ab5+!', refuteSanEn: '6.Bb5+!',
        trapEs: 'Empujar 5...e5 sin 5...a6 previo deja indefensa la diagonal del Rey: 6.Ab5+! fuerza cambios o debilita irreparablemente la casilla d5.',
        trapEn: 'Pushing 5...e5 without playing 5...a6 first walks into 6.Bb5+!, disrupting Black’s coordination and weakening d5 forever.'
      },
      moves: [
        { uci: 'e2e4', sanEs: '1.e4', sanEn: '1.e4', whyEs: 'Toma espacio central estándar.', whyEn: 'Standard central advance.' },
        { uci: 'c7c5', sanEs: '1...c5', sanEn: '1...c5', whyEs: 'Combate d4 asimétricamente buscando contrajuego combativo.', whyEn: 'Fights asymmetrically for d4 while opening future c-file counterplay.' },
        { uci: 'g1f3', sanEs: '2.Cf3', sanEn: '2.Nf3', whyEs: 'Prepara la ruptura abierta d4.', whyEn: 'Prepares the Open Sicilian d4 thrust.' },
        { uci: 'd7d6', sanEs: '2...d6', sanEn: '2...d6', whyEs: 'Vigila e5 e impide e5 blanco con molestia sobre Cf6.', whyEn: 'Covers e5 against a premature pawn push.' },
        { uci: 'd2d4', sanEs: '3.d4', sanEn: '3.d4', whyEs: 'Siciliana abierta: sacrifica el peón central d para abrir todas las líneas.', whyEn: 'Open Sicilian: trades central d-pawn for maximum piece activity.' },
        { uci: 'c5d4', sanEs: '3...cxd4', sanEn: '3...cxd4', whyEs: 'Cambia peón lateral c por peón central d ganando mayoría central.', whyEn: 'Trades flank c-pawn for a central d-pawn majority.' },
        { uci: 'f3d4', sanEs: '4.Cxd4', sanEn: '4.Nxd4', whyEs: 'Centraliza el caballo en d4.', whyEn: 'Centralizes the knight on d4.' },
        { uci: 'g8f6', sanEs: '4...Cf6', sanEn: '4...Nf6', whyEs: 'Ataca e4 obligando a defender antes de avanzar.', whyEn: 'Attacks e4 to prevent effortless fianchetto or c4 binds.' },
        { uci: 'b1c3', sanEs: '5.Cc3', sanEn: '5.Nc3', whyEs: 'Defiende e4 desarrollando normalmente.', whyEn: 'Develops with tempo-neutral e4 defense.' },
        { uci: 'a7a6', sanEs: '5...a6', sanEn: '5...a6', whyEs: 'Jugada estrella Najdorf: quita b5 a todas las piezas blancas y prepara b5/e5.', whyEn: 'Najdorf hallmark: seals off b5 and prepares b5 or e5 cleanly.' },
        { uci: 'c1e3', sanEs: '6.Ae3', sanEn: '6.Be3', whyEs: 'Ataque Inglés: prepara f3, Dd2 y O-O-O.', whyEn: 'English Attack setup aiming for f3, Qd2, and O-O-O.' },
        { uci: 'e7e5', sanEs: '6...e5', sanEn: '6...e5', whyEs: 'Ahora sí, con b5 controlado por a6, e5 expulsa el fuerte caballo central.', whyEn: 'With b5 covered, e5 safely kicks the central knight off d4.' }
      ]
    },
    {
      id: 'francesa', block: 'semiabiertas', eco: 'C02', side: 'b',
      es: 'Defensa Francesa (Avance)', en: 'French Defense (Advance)',
      keySquares: ['d4', 'c5', 'e5'],
      ideaEs: 'Acepta una posición cerrada para atacar sin piedad la base de la cadena blanca d4 mediante c5, Cc6 y Db6.',
      ideaEn: 'Uses a resilient closed chain to relentlessly undermine the base of White’s pawn chain on d4 with c5, Nc6, and Qb6.',
      structEs: 'Cadena rígida d4–e5 vs. d5–e6; ruptura obligada del negro en c5 (y f6 luego).',
      structEn: 'Locked central chain d4–e5 vs d5–e6; Black targets base d4 with c5 and later e5 via f6.',
      badPlansEs: [
        'Dejar intacta la cadena blanca en d4-e5 sin golpear con c5 ni f6.',
        'Cambiar tu propio alfil de casillas negras por nada mientras el de c8 sigue encerrado.'
      ],
      badPlansEn: [
        'Leave White’s d4–e5 pawn chain untouched without playing c5 or f6 breaks.',
        'Lock all files closed while keeping your passive light-squared bishop permanently trapped on c8.'
      ],
      trap: {
        ply: 10,
        blunderUci: 'f1d3', blunderSanEs: '6.Ad3?!', blunderSanEn: '6.Bd3?!',
        refuteUci: 'c5d4', refuteSanEs: '6...cxd4!', refuteSanEn: '6...cxd4!',
        trapEs: 'Si las blancas juegan 6.Ad3?! olvidando que d4 está bajo triple ataque, tras 6...cxd4 7.cxd4 el negro combina Cxd4! aprovechando el golpe ...Dxd4 / ...Ab4+ o gana peón limpio.',
        trapEn: 'Overlooking the pressure on d4 with 6.Bd3?! lets 6...cxd4 7.cxd4 drop d4 or force tactical concessions against White’s queen and b2.'
      },
      moves: [
        { uci: 'e2e4', sanEs: '1.e4', sanEn: '1.e4', whyEs: 'Control central directo.', whyEn: 'Direct central claim.' },
        { uci: 'e7e6', sanEs: '1...e6', sanEn: '1...e6', whyEs: 'Prepara d5 con respaldo sólido de peón.', whyEn: 'Prepares a solidly supported d5 counter.' },
        { uci: 'd2d4', sanEs: '2.d4', sanEn: '2.d4', whyEs: 'Forma el centro clásico e4+d4.', whyEn: 'Forms the full classical pawn center.' },
        { uci: 'd7d5', sanEs: '2...d5', sanEn: '2...d5', whyEs: 'Ataca inmediatamente e4.', whyEn: 'Immediately challenges White’s e4 pawn.' },
        { uci: 'e4e5', sanEs: '3.e5', sanEn: '3.e5', whyEs: 'Variante del Avance: fija ventaja espacial en el flanco rey.', whyEn: 'Advance Variation: fixes central space on the kingside.' },
        { uci: 'c7c5', sanEs: '3...c5', sanEn: '3...c5', whyEs: 'Regla de oro contra el avance: golpea la BASE d4 de la cadena blanca.', whyEn: 'Golden rule against locked chains: attack the base on d4.' },
        { uci: 'c2c3', sanEs: '4.c3', sanEn: '4.c3', whyEs: 'Refuerza la base d4 con otro peón.', whyEn: 'Bolsters the d4 base with a supporting pawn.' },
        { uci: 'b8c6', sanEs: '4...Cc6', sanEn: '4...Nc6', whyEs: 'Aumenta la presión sobre d4.', whyEn: 'Piles another attacker onto d4.' },
        { uci: 'g1f3', sanEs: '5.Cf3', sanEn: '5.Nf3', whyEs: 'Añade un segundo defensor a d4.', whyEn: 'Adds another defender to d4.' },
        { uci: 'd8b6', sanEs: '5...Db6', sanEn: '5...Qb6', whyEs: 'Triple presión sobre d4 además de vigilar b2 para inmovilizar el alfil c1.', whyEn: 'Targets d4 a third time and pins the c1 bishop to defending b2.' },
        { uci: 'f1e2', sanEs: '6.Ae2', sanEn: '6.Be2', whyEs: 'Defiende tranquilamente manteniendo sólida la estructura para enrocar.', whyEn: 'Solid defensive move preparing castling without conceding d4.' },
        { uci: 'c5d4', sanEs: '6...cxd4', sanEn: '6...cxd4', whyEs: 'Fija el centro e induce la continuación ...Cge7–Cf5 sobre d4.', whyEn: 'Clarifies central tension before swinging Ng8–e7–f5 onto d4.' }
      ]
    },
    {
      id: 'caro_kann', block: 'semiabiertas', eco: 'B12', side: 'b',
      es: 'Defensa Caro-Kann', en: 'Caro-Kann Defense',
      keySquares: ['d5', 'f5', 'c5'],
      ideaEs: 'Prepara d5 con c6 para poder sacar primero el alfil de casillas claras a f5 o g4 ANTES de cerrar con e6.',
      ideaEn: 'Supports d5 with c6 specifically so the light-squared bishop escapes out to f5 or g4 BEFORE closing with e6.',
      structEs: 'Estructura sólida con triángulo c6–d5–e6 y sin el “alfil malo” típico de la Francesa.',
      structEn: 'Ultra-solid pawn triangle c6–d5–e6 without the trapped bad c8 bishop.',
      badPlansEs: [
        'Jugar e6 antes de sacar el alfil c8 convirtiendo la posición en una Francesa peor con tiempo de menos.',
        'Atacar sin sentido en el flanco rey descuidando la ruptura c5 sobre d4.'
      ],
      badPlansEn: [
        'Play e6 before developing the c8 bishop, transposing into a cramped French a tempo down.',
        'Forget the liberating c5 break against d4.'
      ],
      trap: {
        ply: 5,
        blunderUci: 'e7e6', blunderSanEs: '3...e6?!', blunderSanEn: '3...e6?!',
        refuteUci: 'c2c4', refuteSanEs: '4.c4!', refuteSanEn: '4.c4!',
        trapEs: 'Cerrar con 3...e6?! sin sacar el alfil a f5 regala exactamente el tiempo que c6 quiso evitar; el blanco gana espacio con 4.c4 / Cf3 dominando al “alfil malo” encerrado.',
        trapEn: 'Closing with 3...e6?! traps your own c8 bishop like an inferior French; White grabs space freely.'
      },
      moves: [
        { uci: 'e2e4', sanEs: '1.e4', sanEn: '1.e4', whyEs: 'Primer paso en el centro.', whyEn: 'Claims central space.' },
        { uci: 'c7c6', sanEs: '1...c6', sanEn: '1...c6', whyEs: 'Prepara d5 manteniendo libre la diagonal c8–h3 para el alfil.', whyEn: 'Prepares d5 while keeping the c8–h3 bishop diagonal open.' },
        { uci: 'd2d4', sanEs: '2.d4', sanEn: '2.d4', whyEs: 'Toma el centro pleno.', whyEn: 'Occupies the full center.' },
        { uci: 'd7d5', sanEs: '2...d5', sanEn: '2...d5', whyEs: 'Desafía el peón e4 desde una base firme.', whyEn: 'Challenges White’s e4 pawn cleanly.' },
        { uci: 'e4e5', sanEs: '3.e5', sanEn: '3.e5', whyEs: 'Variante del Avance: gana espacio obligando al negro a demostrar su alfil.', whyEn: 'Advance Variation: stakes out space and asks Black to prove c8.' },
        { uci: 'c8f5', sanEs: '3...Af5', sanEn: '3...Bf5', whyEs: 'La gran virtud de Caro-Kann: libera al alfil de casillas claras fuera de la cadena.', whyEn: 'Core Caro-Kann payoff: activates the light-squared bishop outside the chain.' },
        { uci: 'g1f3', sanEs: '4.Cf3', sanEn: '4.Nf3', whyEs: 'Desarrollo sano (variante Clásica/Short).', whyEn: 'Healthy Short-System development.' },
        { uci: 'e7e6', sanEs: '4...e6', sanEn: '4...e6', whyEs: 'Ahora sí cierra e6 con el alfil ya activo afuera y abre f8.', whyEn: 'Now safely shuts e6 with the bishop already outside and opens f8.' },
        { uci: 'f1e2', sanEs: '5.Ae2', sanEn: '5.Be2', whyEs: 'Prepara enroque corto tranquilo.', whyEn: 'Prepares smooth kingside castling.' },
        { uci: 'b8d7', sanEs: '5...Cd7', sanEn: '5...Nd7', whyEs: 'Desarrolla sin tapar el futuro empuje liberador ...c5.', whyEn: 'Develops cleanly without blocking the upcoming ...c5 break.' },
        { uci: 'e1g1', sanEs: '6.O-O', sanEn: '6.O-O', whyEs: 'Seguridad real antes de luchar en el centro.', whyEn: 'Secures the King before central skirmishes.' },
        { uci: 'g8e7', sanEs: '6...Ce7', sanEn: '6...Ne7', whyEs: 'Apunta a f5/c6 y deja paso libre a ...c5.', whyEn: 'Headed to f5 or g6 without obstructing ...c5.' }
      ]
    },
    {
      id: 'escandinava', block: 'semiabiertas', eco: 'B01', side: 'b',
      es: 'Defensa Escandinava', en: 'Scandinavian Defense',
      keySquares: ['d5', 'a5', 'c6'],
      ideaEs: 'Rompe en el centro desde el primer movimiento (1...d5), evita líneas complejas y logra una estructura muy sólida con c6 + e6.',
      ideaEn: 'Immediately liquidates central e4 tension on move 1, retreating the Queen safely to a5 behind a rock-solid c6+e6 fortress.',
      structEs: 'Estructura Caro-Kann tras c6–e6, con alfil de casillas claras afuera en f5/g4.',
      structEn: 'Rock-solid c6–e6 structure with the light-squared bishop comfortably active outside.',
      badPlansEs: [
        'Exponer la Dama negra en casillas centrales atacables (d6, e5) perdiendo varios tiempos.',
        'Dejar sin desarrollar el alfil de c8 detrás de e6.'
      ],
      badPlansEn: [
        'Leave the Black Queen exposed in central squares (Qd6, Qe5) dropping repeated tempi.',
        'Trapping the c8 bishop inside with passive ...e6 before Bf5/Bg4.'
      ],
      trap: {
        ply: 5,
        blunderUci: 'd5c5', blunderSanEs: '3...Dc5?!', blunderSanEn: '3...Qc5?!',
        refuteUci: 'd2d4', refuteSanEs: '4.d4!', refuteSanEn: '4.d4!',
        trapEs: 'Colocar la Dama en c5 o e5 frente al ataque blanco regala desarrollos gratuitos: 4.d4! y luego Cf3/Ae3 persiguen la Dama por todo el tablero.',
        trapEn: 'Leaving the Queen exposed on c5 hands White free tempi with 4.d4!, Be3, and rapid piece development.'
      },
      moves: [
        { uci: 'e2e4', sanEs: '1.e4', sanEn: '1.e4', whyEs: 'Ocupa e4.', whyEn: 'Standard opening move.' },
        { uci: 'd7d5', sanEs: '1...d5', sanEn: '1...d5', whyEs: 'Reta directamente a e4 desde la jugada 1 sin rodeos.', whyEn: 'Challenges e4 directly on move 1.' },
        { uci: 'e4d5', sanEs: '2.exd5', sanEn: '2.exd5', whyEs: 'Captura obligada para no ceder la iniciativa.', whyEn: 'Principal capture keeping White’s slight initiative.' },
        { uci: 'd8d5', sanEs: '2...Dxd5', sanEn: '2...Qxd5', whyEs: 'Recaptura central buscando llevar rápido el alfil c8 afuera.', whyEn: 'Immediate recapture planning quick c8 bishop activation.' },
        { uci: 'b1c3', sanEs: '3.Cc3', sanEn: '3.Nc3', whyEs: 'Desarrolla ganando un tiempo claro sobre la Dama negra.', whyEn: 'Develops with an instant tempo on the Black Queen.' },
        { uci: 'd5a5', sanEs: '3...Da5', sanEn: '3...Qa5', whyEs: 'Refugio clásico seguro en a5: sigue clavando c3 y evita más acoso inmediato.', whyEn: 'Classic safe haven on a5 pinning c3 and avoiding quick harassment.' },
        { uci: 'd2d4', sanEs: '4.d4', sanEn: '4.d4', whyEs: 'Toma el centro que quedó vacante.', whyEn: 'Claims central space.' },
        { uci: 'g8f6', sanEs: '4...Cf6', sanEn: '4...Nf6', whyEs: 'Desarrolla controlando e4.', whyEn: 'Develops while watching e4.' },
        { uci: 'g1f3', sanEs: '5.Cf3', sanEn: '5.Nf3', whyEs: 'Completa el desarrollo natural de caballos.', whyEn: 'Natural knight development.' },
        { uci: 'c8f5', sanEs: '5...Af5', sanEn: '5...Bf5', whyEs: 'Saca el alfil clave antes de cerrar e6.', whyEn: 'Liberates the light-squared bishop prior to e6.' },
        { uci: 'f1c4', sanEs: '6.Ac4', sanEn: '6.Bc4', whyEs: 'Presiona f7 y desarrolla pieza menor.', whyEn: 'Activates the light-squared bishop onto c4.' },
        { uci: 'e7e6', sanEs: '6...e6', sanEn: '6...e6', whyEs: 'Consolida el centro dejando un esquema muy sólido con ...c6 pronto.', whyEn: 'Locks down the kingside bishop path into a resilient fortress.' }
      ]
    },
    {
      id: 'gambito_dama', block: 'cerradas', eco: 'D37', side: 'w',
      es: 'Gambito de Dama Declinado', en: 'Queen’s Gambit Declined',
      keySquares: ['c4', 'd5', 'e4'],
      ideaEs: 'Ofrece el peón lateral c4 para desviar al peón d5 del centro, desarrollando rápido sobre la columna semiabierta c y atacando en minoría.',
      ideaEn: 'Offers the wing c4-pawn to deflect d5, building pressure down the c-file and classic minority-attack plans.',
      structEs: 'Centro firme d4 vs. d5 sostenido por e6; ruptura temática e4 o ataque b4-b5.',
      structEn: 'Orthodox d4 vs. d5–e6 wall; typical breaks with e4 or a b4–b5 minority attack.',
      badPlansEs: [
        'Jugar e3 antes de sacar el alfil c1 dejando ese alfil encerrado sin motivo.',
        'Permitir al negro liberar su alfil de c8 jugando ...e5 impunemente.'
      ],
      badPlansEn: [
        'Block your own c1 bishop inside behind e3 before activating it to g5/f4.',
        'Allow Black a completely free ...e5 break without central tension.'
      ],
      trap: {
        ply: 3,
        blunderUci: 'g8f6', blunderSanEs: '2...Cf6?!', blunderSanEn: '2...Nf6?!',
        refuteUci: 'c4d5', refuteSanEs: '3.cxd5!', refuteSanEn: '3.cxd5!',
        trapEs: 'Responder 2...Cf6?! (Defensa Marshall) sin apoyar d5 permite 3.cxd5 Cxd5 4.e4!, expulsando al caballo y dando al blanco dos peones centrales libres con tiempo.',
        trapEn: 'Playing 2...Nf6?! without pawn support on d5 invites 3.cxd5 Nxd5 4.e4!, kicking the knight to erect a massive central pawn duo.'
      },
      moves: [
        { uci: 'd2d4', sanEs: '1.d4', sanEn: '1.d4', whyEs: 'Controla e5 y c5 protegiendo sólidamente d4 por la Dama.', whyEn: 'Controls e5/c5 while solidly defended by the Queen.' },
        { uci: 'd7d5', sanEs: '1...d5', sanEn: '1...d5', whyEs: 'Planta peón en el centro evitando e4 inmediato.', whyEn: 'Plants a firm central peg preventing e4.' },
        { uci: 'c2c4', sanEs: '2.c4', sanEn: '2.c4', whyEs: 'Gambito de Dama: presiona el peón d5 desde un flanco para dominar el centro.', whyEn: 'Queen’s Gambit: challenges d5 from the side to win central control.' },
        { uci: 'e7e6', sanEs: '2...e6', sanEn: '2...e6', whyEs: 'Declina con firmeza: si blanca captura cxd5, negra retoma con ...exd5.', whyEn: 'Solidly declines, keeping a pawn anchor on d5 via ...exd5.' },
        { uci: 'b1c3', sanEs: '3.Cc3', sanEn: '3.Nc3', whyEs: 'Desarrolla presionando d5 sin bloquear el peón c.', whyEn: 'Develops behind the c-pawn, increasing pressure on d5.' },
        { uci: 'g8f6', sanEs: '3...Cf6', sanEn: '3...Nf6', whyEs: 'Ahora sí refuerza d5 y controla e4.', whyEn: 'Now safely guards d5 and eyes e4.' },
        { uci: 'c1g5', sanEs: '4.Ag5', sanEn: '4.Bg5', whyEs: 'Clava al caballo defensor f6 aumentando indirectamente la presión sobre d5.', whyEn: 'Pins the f6 knight to heighten pressure against d5.' },
        { uci: 'f8e7', sanEs: '4...Ae7', sanEn: '4...Be7', whyEs: 'Rompe la clavada y prepara enrocar con seguridad.', whyEn: 'Neutralizes the pin and readies castling.' },
        { uci: 'e2e3', sanEs: '5.e3', sanEn: '5.e3', whyEs: 'Con el alfil c1 ya afuera, abre paso al alfil f1 y defiende c4.', whyEn: 'With the c1 bishop already outside, frees f1 and guards c4.' },
        { uci: 'e8g8', sanEs: '5...O-O', sanEn: '5...O-O', whyEs: 'Seguridad real inmediata.', whyEn: 'Immediate King safety.' },
        { uci: 'g1f3', sanEs: '6.Cf3', sanEn: '6.Nf3', whyEs: 'Completa el desarrollo del flanco rey.', whyEn: 'Completes kingside minor-piece development.' },
        { uci: 'b8d7', sanEs: '6...Cbd7', sanEn: '6...Nbd7', whyEs: 'Recuerda no obstruir el futuro contraataque ...c5 con Cc6.', whyEn: 'Develops via d7 so the liberating ...c5 pawn break stays unblocked.' }
      ]
    },
    {
      id: 'sistema_londres', block: 'cerradas', eco: 'D02', side: 'w',
      es: 'Sistema Londres', en: 'London System',
      keySquares: ['f4', 'e5', 'c3'],
      ideaEs: 'Esquema universal y sólido: pirámide c3–d4–e3 con alfil activo en f4 y caballo en e5 para atacar el enroque rival.',
      ideaEn: 'Universal solid system: c3–d4–e3 pawn pyramid with an active dark-squared bishop on f4 eyeing a strong e5 outpost.',
      structEs: 'Triángulo pétreo c3–d4–e3 que anula alfiles rivales y protege toda incursión en b2.',
      structEn: 'Rock-solid c3–d4–e3 pyramid neutralizing diagonal pressure onto d4.',
      badPlansEs: [
        'Jugar e3 demasiado pronto antes de sacar el alfil c1 a f4.',
        'Avanzar c4 en un sistema donde ya gastaste tiempo en c3.'
      ],
      badPlansEn: [
        'Lock the c1 bishop inside behind e3 before stepping out to f4.',
        'Waste a tempo pushing c4 after already committing to c3.'
      ],
      trap: {
        ply: 9,
        blunderUci: 'd8b6', blunderSanEs: '5...Db6?!', blunderSanEn: '5...Qb6?!',
        refuteUci: 'd1b3', refuteSanEs: '6.Db3!', refuteSanEn: '6.Qb3!',
        trapEs: 'Muchos jugadores atacan el peón b2 con 5...Db6; 6.Db3! defiende b2, invita al cambio y si las negras capturan en b3, las blancas abren la columna “a” gratis para su torre.',
        trapEn: 'Black often raids b2 with 5...Qb6; calmly meeting it with 6.Qb3! turns any capture on b3 into a free open a-file for White’s rook.'
      },
      moves: [
        { uci: 'd2d4', sanEs: '1.d4', sanEn: '1.d4', whyEs: 'Fija el centro de dama.', whyEn: 'Stakes out the Queen’s pawn center.' },
        { uci: 'd7d5', sanEs: '1...d5', sanEn: '1...d5', whyEs: 'Iguala en el centro.', whyEn: 'Matches d4 directly.' },
        { uci: 'g1f3', sanEs: '2.Cf3', sanEn: '2.Nf3', whyEs: 'Controla e5 y desarrolla flexiblemente.', whyEn: 'Controls e5 with flexible development.' },
        { uci: 'g8f6', sanEs: '2...Cf6', sanEn: '2...Nf6', whyEs: 'Controla e4 e iguala desarrollo.', whyEn: 'Mirrors central control.' },
        { uci: 'c1f4', sanEs: '3.Af4', sanEn: '3.Bf4', whyEs: 'Sello del Londres: activa el alfil fuera de la cadena antes de cerrar con e3.', whyEn: 'London hallmark: develops the bishop to f4 before locking in with e3.' },
        { uci: 'c7c5', sanEs: '3...c5', sanEn: '3...c5', whyEs: 'Desafía el centro d4 del blanco.', whyEn: 'Challenges White’s d4 anchor cleanly.' },
        { uci: 'e2e3', sanEs: '4.e3', sanEn: '4.e3', whyEs: 'Consolida el centro y abre paso al alfil f1.', whyEn: 'Reinforces d4 and opens the f1 bishop.' },
        { uci: 'b8c6', sanEs: '4...Cc6', sanEn: '4...Nc6', whyEs: 'Presiona d4 y desarrolla.', whyEn: 'Develops with pressure on d4.' },
        { uci: 'c2c3', sanEs: '5.c3', sanEn: '5.c3', whyEs: 'Completa la pirámide impenetrable c3–d4–e3.', whyEn: 'Completes the bulletproof c3–d4–e3 pyramid.' },
        { uci: 'e7e6', sanEs: '5...e6', sanEn: '5...e6', whyEs: 'Sostiene d5 y habilita el alfil f8.', whyEn: 'Supports d5 and develops f8 bishop.' },
        { uci: 'b1d2', sanEs: '6.Cbd2', sanEn: '6.Nbd2', whyEs: 'Apoya e4 y permite Ad3 + O-O.', whyEn: 'Supports an e4 push or Ne5 knight hop.' },
        { uci: 'f8d6', sanEs: '6...Ad6', sanEn: '6...Bd6', whyEs: 'Cuestiona directamente al alfil dominante de f4.', whyEn: 'Directly challenges the proud London bishop on f4.' }
      ]
    },
    {
      id: 'eslava', block: 'cerradas', eco: 'D15', side: 'b',
      es: 'Defensa Eslava', en: 'Slav Defense',
      keySquares: ['d5', 'c4', 'f5'],
      ideaEs: 'Sostiene d5 con c6 para dejar libre al alfil de c8 hacia f5 y amenazar tomar dxc4 seguido de ...b5 si el blanco descuida a4.',
      ideaEn: 'Defends d5 with c6 so c8 remains free for Bf5 while threatening ...dxc4 and ...b5 if White skips a4.',
      structEs: 'Estructura compacta sin puntos débiles ni alfiles malos.',
      structEn: 'Balanced, rock-solid pawn structure with zero trapped bishops.',
      badPlansEs: [
        'Jugar ...b6 temprano dejando débil toda la diagonal h1–a8.',
        'Olvidar ...e6 tras sacar Af5 exponiendo golpes tácticos en b7 y e4.'
      ],
      badPlansEn: [
        'Play an unmotivated ...b6 exposing the long h1–a8 diagonal.',
        'Leave f8 closed indefinitely without ...e6 once the c8 bishop steps out.'
      ],
      trap: {
        ply: 8,
        blunderUci: 'e2e3', blunderSanEs: '5.e3?', blunderSanEn: '5.e3?',
        refuteUci: 'b7b5', refuteSanEs: '5...b5!', refuteSanEn: '5...b5!',
        trapEs: 'El porqué de 5.a4 en la Eslava: si el blanco juega codicioso 5.e3? buscando recuperar rápido c4, el negro defiende el peón ganado para siempre con 5...b5!',
        trapEn: 'Why 5.a4 is essential: if White plays greedy 5.e3? expecting an easy recapture on c4, Black anchors the extra pawn forever via 5...b5!'
      },
      moves: [
        { uci: 'd2d4', sanEs: '1.d4', sanEn: '1.d4', whyEs: 'Toma espacio central.', whyEn: 'Claims central space.' },
        { uci: 'd7d5', sanEs: '1...d5', sanEn: '1...d5', whyEs: 'Iguala d4.', whyEn: 'Matches d4 directly.' },
        { uci: 'c2c4', sanEs: '2.c4', sanEn: '2.c4', whyEs: 'Gambito de Dama sobre d5.', whyEn: 'Queen’s Gambit challenge.' },
        { uci: 'c7c6', sanEs: '2...c6', sanEn: '2...c6', whyEs: 'Eslava: defiende d5 sin encerrar al alfil de c8.', whyEn: 'Slav: holds d5 firmly while keeping c8 bishop free.' },
        { uci: 'g1f3', sanEs: '3.Cf3', sanEn: '3.Nf3', whyEs: 'Desarrolla controlando e5.', whyEn: 'Develops with e5 control.' },
        { uci: 'g8f6', sanEs: '3...Cf6', sanEn: '3...Nf6', whyEs: 'Vigila e4.', whyEn: 'Guarding e4.' },
        { uci: 'b1c3', sanEs: '4.Cc3', sanEn: '4.Nc3', whyEs: 'Aumenta presión sobre d5.', whyEn: 'Adds pressure on d5.' },
        { uci: 'd5c4', sanEs: '4...dxc4', sanEn: '4...dxc4', whyEs: 'Toma en c4 obligando al blanco a gastar a4 para impedir b5.', whyEn: 'Captures c4 to force 5.a4 before Black clamps down with ...b5.' },
        { uci: 'a2a4', sanEs: '5.a4', sanEn: '5.a4', whyEs: 'Frena de raíz la jugada negra ...b5.', whyEn: 'Prevents Black from cementing c4 with ...b5.' },
        { uci: 'c8f5', sanEs: '5...Af5', sanEn: '5...Bf5', whyEs: 'Aprovecha la diagonal libre c8–h3 para dominar e4.', whyEn: 'Activates the bishop out to f5 fighting for e4.' },
        { uci: 'e2e3', sanEs: '6.e3', sanEn: '6.e3', whyEs: 'Prepara Axc4 recuperando el peón limpiamente.', whyEn: 'Prepares Bxc4 recovering the pawn cleanly.' },
        { uci: 'e7e6', sanEs: '6...e6', sanEn: '6...e6', whyEs: 'Sostiene f5 y prepara desarrollo completo (Ab4/Ae7 + O-O).', whyEn: 'Consolidates f5 and prepares ...Bb4/Be7 and castling.' }
      ]
    },
    {
      id: 'india_rey', block: 'hipermodernas', eco: 'E92', side: 'b',
      es: 'Defensa India de Rey', en: 'King’s Indian Defense',
      keySquares: ['g7', 'e5', 'f5'],
      ideaEs: 'Estrategia hipermoderna: cede el centro al blanco primero, fiancheta en g7 y lanza una avalancha sobre el enroque rival con ...e5 y ...f5.',
      ideaEn: 'Hypermodern fighting defense: invites White to overextend in the center, then counterstrikes fiercely with ...Bg7, ...e5, and ...f5.',
      structEs: 'Fianchetto f7–g6–h7 con alfil en g7 y ruptura central ...e5 tras bloquear con ...f5.',
      structEn: 'Fianchettoed g7 bishop aiming across the long dark diagonal behind a locked ...e5 + ...f5 storm.',
      badPlansEs: [
        'Jugar ...c6 y ...d5 pasivo dejando muerto a tu alfil estrella de g7.',
        'Atacar en el flanco de dama olvidando el golpe central ...e5 o ...c5.'
      ],
      badPlansEn: [
        'Play passive ...c6/...d5 walling off your own prized g7 dragon bishop.',
        'Ignore the ...e5 / ...c5 central counterstrike while White rolls unimpeded.'
      ],
      trap: {
        ply: 7,
        blunderUci: 'e8g8', blunderSanEs: '4...O-O?!', blunderSanEn: '4...O-O?!',
        refuteUci: 'e4e5', refuteSanEs: '5.e5!', refuteSanEn: '5.e5!',
        trapEs: 'Omitir 4...d6 antes de enrocar deja indefensa la casilla e5: 5.e5! ataca al caballo f6 y desaloja toda la defensa negra ganando muchísimo espacio.',
        trapEn: 'Skipping 4...d6 allows an immediate 5.e5!, driving the knight awkwardly and handing White a crushing central space lead.'
      },
      moves: [
        { uci: 'd2d4', sanEs: '1.d4', sanEn: '1.d4', whyEs: 'Inicia abriendo dominio central.', whyEn: 'Claims central territory.' },
        { uci: 'g8f6', sanEs: '1...Cf6', sanEn: '1...Nf6', whyEs: 'Impide 2.e4 inmediato con pieza flexible.', whyEn: 'Prevents 2.e4 cleanly without committing center pawns.' },
        { uci: 'c2c4', sanEs: '2.c4', sanEn: '2.c4', whyEs: 'Gana espacio en c4.', whyEn: 'Gains queenside space.' },
        { uci: 'g7g6', sanEs: '2...g6', sanEn: '2...g6', whyEs: 'Prepara el fianchetto del alfil rey sobre la gran diagonal h8–a1.', whyEn: 'Prepares kingside bishop fianchetto onto the h8–a1 diagonal.' },
        { uci: 'b1c3', sanEs: '3.Cc3', sanEn: '3.Nc3', whyEs: 'Prepara el empuje e4.', whyEn: 'Prepares e4.' },
        { uci: 'f8g7', sanEs: '3...Ag7', sanEn: '3...Bg7', whyEs: 'Dispara desde g7 hacia d4 y e5.', whyEn: 'Exerts long-range pressure onto d4 and e5.' },
        { uci: 'e2e4', sanEs: '4.e4', sanEn: '4.e4', whyEs: 'El blanco construye un gran centro clásico c4–d4–e4.', whyEn: 'White builds an imposing classical c4–d4–e4 center.' },
        { uci: 'd7d6', sanEs: '4...d6', sanEn: '4...d6', whyEs: 'Vital para frenar e5 y apoyar el futuro golpe ...e5.', whyEn: 'Essential stop against 5.e5 while preparing ...e5.' },
        { uci: 'g1f3', sanEs: '5.Cf3', sanEn: '5.Nf3', whyEs: 'Desarrollo natural clásico.', whyEn: 'Classical knight development.' },
        { uci: 'e8g8', sanEs: '5...O-O', sanEn: '5...O-O', whyEs: 'Rey a salvo en cinco jugadas listo para atacar.', whyEn: 'King castled safely in 5 moves ready for counterplay.' },
        { uci: 'f1e2', sanEs: '6.Ae2', sanEn: '6.Be2', whyEs: 'Desarrolla el último alfil preparando O-O.', whyEn: 'Develops quietly to castle.' },
        { uci: 'e7e5', sanEs: '6...e5', sanEn: '6...e5', whyEs: 'Golpe central temático de la India de Rey desafiando d4.', whyEn: 'The hallmark King’s Indian counterstrike targeting d4.' }
      ]
    },
    {
      id: 'inglesa', block: 'hipermodernas', eco: 'A20', side: 'w',
      es: 'Apertura Inglesa (1.c4)', en: 'English Opening (1.c4)',
      keySquares: ['c4', 'd5', 'g2'],
      ideaEs: 'Siciliana con colores invertidos y un tiempo de más: domina d5 desde el flanco con c4, Cc3 y alfil fianchetado en g2.',
      ideaEn: 'Plays a Sicilian in reverse with an extra tempo: clamps down on d5 using c4, Nc3, and a powerful fianchettoed g2 bishop.',
      structEs: 'Fianchetto rey g2 apuntando por a8–h1 y presión constante por la columna c.',
      structEn: 'Fianchettoed Bg2 slicing along a8–h1 coupled with c-file and queenside play.',
      badPlansEs: [
        'Debilitar d4 jugando e4 prematuro cuando g2 ya domina las casillas claras.',
        'Olvidar la lucha sobre la casilla central d5 regalándola a los caballos rivales.'
      ],
      badPlansEn: [
        'Play e4 prematurely creating a huge hole on d4.',
        'Concede the central d5 square effortlessly to enemy minor pieces.'
      ],
      trap: {
        ply: 11,
        blunderUci: 'f8e7', blunderSanEs: '6...Ae7?', blunderSanEn: '6...Be7?',
        refuteUci: 'f3e5', refuteSanEs: '7.Cxe5!', refuteSanEn: '7.Nxe5!',
        trapEs: 'Descuidar el caballo de d5 tras 6.Ag2 con 6...Ae7? cae en 7.Cxe5! Cxe5 8.Axd5/Cxd5 ganando un peón central limpio por el doble ataque en d5.',
        trapEn: 'Leaving the d5 knight loose after 6.Bg2 with 6...Be7? loses a clean central pawn to 7.Nxe5! due to stacked pressure along the long diagonal.'
      },
      moves: [
        { uci: 'c2c4', sanEs: '1.c4', sanEn: '1.c4', whyEs: 'Controla d5 desde el flanco evitando esquemas simétricos aburridos.', whyEn: 'Fights for d5 from the flank keeping flexible central options.' },
        { uci: 'e7e5', sanEs: '1...e5', sanEn: '1...e5', whyEs: 'Siciliana invertida: el negro ocupa espacio en e5.', whyEn: 'Reversed Sicilian: Black stakes out central territory on e5.' },
        { uci: 'b1c3', sanEs: '2.Cc3', sanEn: '2.Nc3', whyEs: 'Refuerza el control total sobre d5.', whyEn: 'Tightens white grip over d5.' },
        { uci: 'g8f6', sanEs: '2...Cf6', sanEn: '2...Nf6', whyEs: 'Desarrolla y prepara d5.', whyEn: 'Develops toward d5 break.' },
        { uci: 'g1f3', sanEs: '3.Cf3', sanEn: '3.Nf3', whyEs: 'Ataca e5 obligando a defender.', whyEn: 'Applies immediate pressure onto e5.' },
        { uci: 'b8c6', sanEs: '3...Cc6', sanEn: '3...Nc6', whyEs: 'Defiende e5 con desarrollo sano.', whyEn: 'Defends e5 cleanly.' },
        { uci: 'g2g3', sanEs: '4.g3', sanEn: '4.g3', whyEs: 'Prepara el alfil dragón blanco en g2 apuntando a todo el centro.', whyEn: 'Prepares the proud g2 dragon bishop aimed straight through d5.' },
        { uci: 'd7d5', sanEs: '4...d5', sanEn: '4...d5', whyEs: 'Aprovecha la ocasión para abrir el centro.', whyEn: 'Challenges the center before Bg2 locks in.' },
        { uci: 'c4d5', sanEs: '5.cxd5', sanEn: '5.cxd5', whyEs: 'Toma peón central a cambio de peón lateral (ventaja estratégica típica).', whyEn: 'Swaps wing c-pawn for central d-pawn opening the c-file.' },
        { uci: 'f6d5', sanEs: '5...Cxd5', sanEn: '5...Nxd5', whyEs: 'Centraliza el caballo.', whyEn: 'Centralizes the knight.' },
        { uci: 'f1g2', sanEs: '6.Ag2', sanEn: '6.Bg2', whyEs: 'Clava y dispara inmediatamente contra el caballo central en d5.', whyEn: 'Unleashes immediate diagonal fire onto d5.' },
        { uci: 'd5b6', sanEs: '6...Cb6', sanEn: '6...Nb6', whyEs: 'Retira el caballo a salvo de las amenazas tácticas en d5.', whyEn: 'Retreats safely from the d5 crossfire while keeping b8–c6 harmonious.' }
      ]
    }
  ];

  var BY_ID = {};
  OPENINGS.forEach(function (o) { BY_ID[o.id] = o; });

  /* =====================================================================
   * ECO OPENING DETECTOR BOOK (45+ canonical opening & defense prefixes)
   * ===================================================================== */
  var ECO_BOOK = [
    { eco: 'A00', es: 'Van Geet Opening (1.Cc3)', en: 'Van Geet Opening (1.Nc3)', moves: ['b1c3'] },
    { eco: 'A00', es: 'Apertura Polaca (Sokolsky)', en: 'Polish Opening (1.b4)', moves: ['b2b4'] },
    { eco: 'A01', es: 'Ataque Nimzo-Larsen', en: 'Nimzowitsch-Larsen Attack', moves: ['b2b3'] },
    { eco: 'A02', es: 'Apertura Bird', en: 'Bird’s Opening', moves: ['f2f4'] },
    { eco: 'A04', es: 'Apertura Réti', en: 'Réti Opening', moves: ['g1f3'] },
    { eco: 'A06', es: 'Apertura Réti (1...d5)', en: 'Réti Opening (1...d5)', moves: ['g1f3','d7d5'] },
    { eco: 'A09', es: 'Gambito Réti (2.c4)', en: 'Réti Opening: Advance (2.c4)', moves: ['g1f3','d7d5','c2c4'] },
    { eco: 'A10', es: 'Apertura Inglesa', en: 'English Opening', moves: ['c2c4'] },
    { eco: 'A15', es: 'Inglesa: Anglo-India', en: 'English: Anglo-Indian Defense', moves: ['c2c4','g8f6'] },
    { eco: 'A20', es: 'Inglesa: Siciliana Invertida', en: 'English: Reversed Sicilian', moves: ['c2c4','e7e5'] },
    { eco: 'A40', es: 'Apertura de Peón Dama', en: 'Queen’s Pawn Game', moves: ['d2d4'] },
    { eco: 'A45', es: 'Defensa India', en: 'Indian Defense', moves: ['d2d4','g8f6'] },
    { eco: 'A80', es: 'Defensa Holandesa', en: 'Dutch Defense', moves: ['d2d4','f7f5'] },
    { eco: 'B00', es: 'Apertura de Peón Rey', en: 'King’s Pawn Game', moves: ['e2e4'] },
    { eco: 'B01', es: 'Defensa Escandinava', en: 'Scandinavian Defense', moves: ['e2e4','d7d5'] },
    { eco: 'B01', es: 'Escandinava: Variante Mieses', en: 'Scandinavian: 3.Nc3 Qa5', moves: ['e2e4','d7d5','e4d5','d8d5','b1c3','d5a5'] },
    { eco: 'B02', es: 'Defensa Alekhine', en: 'Alekhine’s Defense', moves: ['e2e4','g8f6'] },
    { eco: 'B06', es: 'Defensa Moderna', en: 'Modern Defense', moves: ['e2e4','g7g6'] },
    { eco: 'B07', es: 'Defensa Pirc', en: 'Pirc Defense', moves: ['e2e4','d7d6','d2d4','g8f6'] },
    { eco: 'B10', es: 'Defensa Caro-Kann', en: 'Caro-Kann Defense', moves: ['e2e4','c7c6'] },
    { eco: 'B12', es: 'Caro-Kann: Avance', en: 'Caro-Kann: Advance Variation', moves: ['e2e4','c7c6','d2d4','d7d5','e4e5'] },
    { eco: 'B13', es: 'Caro-Kann: Cambio', en: 'Caro-Kann: Exchange Variation', moves: ['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5'] },
    { eco: 'B18', es: 'Caro-Kann Clásica', en: 'Caro-Kann: Classical Variation', moves: ['e2e4','c7c6','d2d4','d7d5','b1c3','d5e4','c3e4','c8f5'] },
    { eco: 'B20', es: 'Defensa Siciliana', en: 'Sicilian Defense', moves: ['e2e4','c7c5'] },
    { eco: 'B22', es: 'Siciliana Alapin (2.c3)', en: 'Sicilian: Alapin Variation', moves: ['e2e4','c7c5','c2c3'] },
    { eco: 'B23', es: 'Siciliana Cerrada (2.Cc3)', en: 'Sicilian: Closed Variation', moves: ['e2e4','c7c5','b1c3'] },
    { eco: 'B30', es: 'Siciliana Rossolimo', en: 'Sicilian: Rossolimo Variation', moves: ['e2e4','c7c5','g1f3','b8c6','f1b5'] },
    { eco: 'B50', es: 'Siciliana Abierta', en: 'Open Sicilian', moves: ['e2e4','c7c5','g1f3','d7d6','d2d4'] },
    { eco: 'B70', es: 'Siciliana Dragón', en: 'Sicilian Dragon', moves: ['e2e4','c7c5','g1f3','d7d6','d2d4','c5d4','f3d4','g8f6','b1c3','g7g6'] },
    { eco: 'B90', es: 'Siciliana Najdorf', en: 'Sicilian Najdorf', moves: ['e2e4','c7c5','g1f3','d7d6','d2d4','c5d4','f3d4','g8f6','b1c3','a7a6'] },
    { eco: 'C00', es: 'Defensa Francesa', en: 'French Defense', moves: ['e2e4','e7e6'] },
    { eco: 'C02', es: 'Francesa del Avance', en: 'French Defense: Advance', moves: ['e2e4','e7e6','d2d4','d7d5','e4e5'] },
    { eco: 'C11', es: 'Francesa Clásica', en: 'French Defense: Classical', moves: ['e2e4','e7e6','d2d4','d7d5','b1c3','g8f6'] },
    { eco: 'C15', es: 'Francesa Winawer', en: 'French Defense: Winawer', moves: ['e2e4','e7e6','d2d4','d7d5','b1c3','f8b4'] },
    { eco: 'C20', es: 'Apertura Abierta (1.e4 e5)', en: 'Open Game (1.e4 e5)', moves: ['e2e4','e7e5'] },
    { eco: 'C23', es: 'Apertura del Alfil', en: 'Bishop’s Opening', moves: ['e2e4','e7e5','f1c4'] },
    { eco: 'C25', es: 'Apertura Vienesa', en: 'Vienna Game', moves: ['e2e4','e7e5','b1c3'] },
    { eco: 'C30', es: 'Gambito de Rey', en: 'King’s Gambit', moves: ['e2e4','e7e5','f2f4'] },
    { eco: 'C40', es: 'Apertura de Caballo de Rey', en: 'King’s Knight Opening', moves: ['e2e4','e7e5','g1f3'] },
    { eco: 'C41', es: 'Defensa Philidor', en: 'Philidor Defense', moves: ['e2e4','e7e5','g1f3','d7d6'] },
    { eco: 'C42', es: 'Defensa Petrov (Rusa)', en: 'Petroff’s Defense', moves: ['e2e4','e7e5','g1f3','g8f6'] },
    { eco: 'C44', es: 'Apertura Escocesa', en: 'Scotch Game', moves: ['e2e4','e7e5','g1f3','b8c6','d2d4'] },
    { eco: 'C47', es: 'Apertura de los Cuatro Caballos', en: 'Four Knights Game', moves: ['e2e4','e7e5','g1f3','b8c6','b1c3','g8f6'] },
    { eco: 'C50', es: 'Apertura Italiana', en: 'Italian Game', moves: ['e2e4','e7e5','g1f3','b8c6','f1c4'] },
    { eco: 'C53', es: 'Italiana: Giuoco Piano', en: 'Italian: Giuoco Piano', moves: ['e2e4','e7e5','g1f3','b8c6','f1c4','f8c5','c2c3'] },
    { eco: 'C55', es: 'Defensa de los Dos Caballos', en: 'Two Knights Defense', moves: ['e2e4','e7e5','g1f3','b8c6','f1c4','g8f6'] },
    { eco: 'C60', es: 'Apertura Española (Ruy López)', en: 'Ruy López (Spanish Game)', moves: ['e2e4','e7e5','g1f3','b8c6','f1b5'] },
    { eco: 'C65', es: 'Española: Defensa Berlinesa', en: 'Ruy López: Berlin Defense', moves: ['e2e4','e7e5','g1f3','b8c6','f1b5','g8f6'] },
    { eco: 'C78', es: 'Española: Defensa Morphy', en: 'Ruy López: Morphy Defense', moves: ['e2e4','e7e5','g1f3','b8c6','f1b5','a7a6','b5a4','g8f6'] },
    { eco: 'D00', es: 'Juego de Peón Dama Cerrado', en: 'Closed Game (1.d4 d5)', moves: ['d2d4','d7d5'] },
    { eco: 'D02', es: 'Sistema Londres', en: 'London System', moves: ['d2d4','d7d5','g1f3','g8f6','c1f4'] },
    { eco: 'D02', es: 'Sistema Londres', en: 'London System', moves: ['d2d4','g8f6','g1f3','d7d5','c1f4'] },
    { eco: 'D06', es: 'Gambito de Dama', en: 'Queen’s Gambit', moves: ['d2d4','d7d5','c2c4'] },
    { eco: 'D10', es: 'Defensa Eslava', en: 'Slav Defense', moves: ['d2d4','d7d5','c2c4','c7c6'] },
    { eco: 'D20', es: 'Gambito de Dama Aceptado', en: 'Queen’s Gambit Accepted', moves: ['d2d4','d7d5','c2c4','d5c4'] },
    { eco: 'D30', es: 'Gambito de Dama Rehusado', en: 'Queen’s Gambit Declined', moves: ['d2d4','d7d5','c2c4','e7e6'] },
    { eco: 'D80', es: 'Defensa Grünfeld', en: 'Grünfeld Defense', moves: ['d2d4','g8f6','c2c4','g7g6','b1c3','d7d5'] },
    { eco: 'E00', es: 'Apertura Catalana', en: 'Catalan Opening', moves: ['d2d4','g8f6','c2c4','e7e6','g2g3'] },
    { eco: 'E12', es: 'Defensa India de Dama', en: 'Queen’s Indian Defense', moves: ['d2d4','g8f6','c2c4','e7e6','g1f3','b7b6'] },
    { eco: 'E20', es: 'Defensa Nimzo-India', en: 'Nimzo-Indian Defense', moves: ['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4'] },
    { eco: 'E60', es: 'Defensa India de Rey', en: 'King’s Indian Defense', moves: ['d2d4','g8f6','c2c4','g7g6'] }
  ];

  // Merge rich mainline steps from OPENINGS + ECO_BOOK so book lookups cover 12-ply theory too
  var FULL_BOOK_LINES = [];
  OPENINGS.forEach(function (o) {
    FULL_BOOK_LINES.push({
      eco: o.eco, es: o.es, en: o.en,
      moves: o.moves.map(function (m) { return m.uci; })
    });
  });
  ECO_BOOK.forEach(function (entry) { FULL_BOOK_LINES.push(entry); });

  /* =====================================================================
   * SAMPLESIZE1 LICHESS CC0 + STOCKFISH 19 DEPTH-16 BOOK ENGINE (3,177 NAMES)
   * ===================================================================== */
  var BOOK_DATA = (typeof window !== 'undefined' && window.CHESS_BOOK_DATA) ? window.CHESS_BOOK_DATA : null;
  var MENU_OPENINGS = (BOOK_DATA && Array.isArray(BOOK_DATA.MENU_OPENINGS)) ? BOOK_DATA.MENU_OPENINGS : [];
  var BOOK = (BOOK_DATA && BOOK_DATA.BOOK) ? BOOK_DATA.BOOK : { names: [], positions: {} };
  var MENU_BY_NAME = Object.create(null);
  MENU_OPENINGS.forEach(function (o) {
    o.movesArr = o.moves ? o.moves.trim().split(/\s+/) : [];
    MENU_BY_NAME[o.name] = o;
  });

  function stateToFen4(st, withEp) {
    var rows = [];
    for (var r = 0; r < 8; r++) {
      var row = '', empty = 0;
      for (var c = 0; c < 8; c++) {
        var p = st.board[r][c];
        if (!p) { empty++; }
        else {
          if (empty) { row += empty; empty = 0; }
          row += p[0] === 'w' ? p[1].toUpperCase() : p[1].toLowerCase();
        }
      }
      if (empty) row += empty;
      rows.push(row);
    }
    var cr = st.castling || {};
    var cast = ((cr.wK ? 'K' : '') + (cr.wQ ? 'Q' : '') + (cr.bK ? 'k' : '') + (cr.bQ ? 'q' : '')) || '-';
    var ep = (withEp && st.ep) ? rcToSq(st.ep[0], st.ep[1]) : '-';
    return rows.join('/') + ' ' + st.turn + ' ' + cast + ' ' + ep;
  }

  function hashFen4(s) {
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0, ch; i < s.length; i++) {
      ch = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }

  function lookupBookPosition(st) {
    if (!BOOK || !BOOK.positions || !st) return null;
    var k1 = hashFen4(stateToFen4(st, true));
    var raw = BOOK.positions[k1];
    if (!raw && st.ep) {
      var k2 = hashFen4(stateToFen4(st, false));
      raw = BOOK.positions[k2];
    }
    if (!raw) return null;
    var nameIdx = raw[0];
    var pair = (nameIdx >= 0 && BOOK.names && BOOK.names[nameIdx]) ? BOOK.names[nameIdx] : null;
    var moves = [];
    if (raw[2]) {
      var toks = raw[2].split(' ');
      for (var i = 0; i < toks.length; i++) {
        var parts = toks[i].split(':');
        if (parts[0]) {
          moves.push({
            uci: parts[0],
            loss: Number(parts[1]) || 0,
            count: Number(parts[2]) || 0
          });
        }
      }
      moves.sort(function (a, b) {
        if (a.loss !== b.loss) return a.loss - b.loss;
        return b.count - a.count;
      });
    }
    return {
      eco: pair ? pair[0] : null,
      name: pair ? pair[1] : null,
      cp: Number(raw[1]) || 0,
      moves: moves
    };
  }

  function getSelectedOpeningEntry(openingFilterVal) {
    if (!openingFilterVal || openingFilterVal === 'any') return null;
    if (MENU_BY_NAME[openingFilterVal]) return MENU_BY_NAME[openingFilterVal];
    if (BY_ID[openingFilterVal]) {
      var legacy = BY_ID[openingFilterVal];
      return {
        name: opName(legacy),
        eco: legacy.eco,
        movesArr: legacy.moves.map(function (m) { return m.uci; })
      };
    }
    return null;
  }

  function detectOpening(uciList) {
    if (!uciList || !uciList.length) {
      return { eco: '—', es: 'Posición inicial', en: 'Starting position', isNamed: false };
    }
    var st = createInitialState();
    var latestNamed = null;
    for (var i = 0; i < uciList.length; i++) {
      try {
        st = applyUciMove(st, uciList[i]);
        var bk = lookupBookPosition(st);
        if (bk && bk.name) {
          latestNamed = { eco: bk.eco || 'A00', es: bk.name, en: bk.name, isNamed: true };
        }
      } catch (_) { break; }
    }
    if (latestNamed) return latestNamed;

    var best = null;
    var bestLen = 0;
    for (var j = 0; j < FULL_BOOK_LINES.length; j++) {
      var line = FULL_BOOK_LINES[j];
      var m = line.moves;
      if (m.length > uciList.length || m.length < bestLen) continue;
      var ok = true;
      for (var k = 0; k < m.length; k++) {
        if (m[k] !== uciList[k]) { ok = false; break; }
      }
      if (ok) {
        bestLen = m.length;
        best = line;
      }
    }
    return best ? { eco: best.eco, es: best.es, en: best.en, isNamed: true } : { eco: 'A00', es: 'Apertura sin nombre', en: 'Unclassified opening', isNamed: false };
  }

  function getBookMovesAtPrefix(uciList, openingFilterVal, curStOpt) {
    var st = curStOpt || createInitialState();
    if (!curStOpt) {
      for (var p = 0; p < uciList.length; p++) {
        try { st = applyUciMove(st, uciList[p]); } catch (_) { break; }
      }
    }
    var filterOp = getSelectedOpeningEntry(openingFilterVal);
    if (filterOp && filterOp.movesArr && uciList.length < filterOp.movesArr.length) {
      var prefixMatch = true;
      for (var j = 0; j < uciList.length; j++) {
        if (filterOp.movesArr[j] !== uciList[j]) { prefixMatch = false; break; }
      }
      if (prefixMatch) return [filterOp.movesArr[uciList.length]];
    }
    var bk = lookupBookPosition(st);
    if (bk && bk.moves.length) {
      return bk.moves.map(function (m) { return m.uci; });
    }
    var out = [];
    var seen = Object.create(null);
    for (var i = 0; i < FULL_BOOK_LINES.length; i++) {
      var m = FULL_BOOK_LINES[i].moves;
      if (m.length <= uciList.length) continue;
      var match = true;
      for (var k = 0; k < uciList.length; k++) {
        if (m[k] !== uciList[k]) { match = false; break; }
      }
      if (match) {
        var nextUci = m[uciList.length];
        if (!seen[nextUci]) { seen[nextUci] = true; out.push(nextUci); }
      }
    }
    return out;
  }

  /* =====================================================================
   * FAST ALPHA-BETA + QUIESCENCE ENGINE (Tactical + Opening Heuristics)
   * ===================================================================== */
  var PIECE_VAL = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };
  var PST_P = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [45, 45, 45, 50, 50, 45, 45, 45],
    [12, 14, 20, 28, 28, 20, 14, 12],
    [4,  8,  16, 30, 30, 12,  6,  4],
    [0,  4,  14, 28, 28,  6,  4, -2],
    [4,  2,  10,  4,  4,  6,  4,  4],
    [6, 10,  8,-22,-22, 10, 12,  6],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ];
  var PST_N = [
    [-40,-25,-18,-18,-18,-18,-25,-40],
    [-25,-10,  4,  6,  6,  4,-10,-25],
    [-18,  4, 16, 20, 20, 16,  4,-18],
    [-18,  8, 20, 26, 26, 20,  8,-18],
    [-15,  8, 18, 26, 26, 18,  8,-15],
    [-18,  4, 22, 16, 16, 22,  4,-18],
    [-25,-10,  2,  8,  8,  2,-10,-25],
    [-40,-20,-18,-18,-18,-18,-20,-40]
  ];
  var PST_B = [
    [-18,-10,-10,-10,-10,-10,-10,-18],
    [-10,  8,  4,  4,  4,  4,  8,-10],
    [-10,  8, 12, 12, 12, 12,  8,-10],
    [-10,  8, 14, 18, 18, 14,  8,-10],
    [-10, 12, 18, 16, 16, 18, 12,-10],
    [-10, 10, 14, 14, 14, 14, 10,-10],
    [-10, 14,  6,  8,  8,  6, 14,-10],
    [-18,-10,-12,-10,-10,-12,-10,-18]
  ];
  var PST_R = [
    [ 6, 10, 10, 12, 12, 10, 10,  6],
    [12, 18, 18, 20, 20, 18, 18, 12],
    [-4,  0,  2,  4,  4,  2,  0, -4],
    [-6, -2,  0,  2,  2,  0, -2, -6],
    [-8, -4, -2,  0,  0, -2, -4, -8],
    [-10,-6, -2, -2, -2, -2, -6,-10],
    [-18,-12,-10,-8, -8,-10,-12,-28],
    [ 0,  0,  4, 12, 10, 12,  0,  0]
  ];
  var PST_K = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-25,-25,-20,-20,-10],
    [12,  14,  2,-10,-10,  2, 14, 12],
    [18,  34, 24,  0, -8, 10, 38, 18]
  ];

  function evalWhite(st) {
    var b = st.board;
    var score = 0;
    var wBishops = 0, bBishops = 0;
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var p = b[r][c];
        if (!p) continue;
        var col = p[0], kind = p[1];
        var rr = col === 'w' ? r : 7 - r;
        var v = PIECE_VAL[kind];
        if (kind === 'P') v += PST_P[rr][c];
        else if (kind === 'N') v += PST_N[rr][c];
        else if (kind === 'B') { v += PST_B[rr][c]; if (col === 'w') wBishops++; else bBishops++; }
        else if (kind === 'R') v += PST_R[rr][c];
        else if (kind === 'K') v += PST_K[rr][c];
        else if (kind === 'Q' && rr < 5) v -= 14; // mild early queen exposure penalty
        score += col === 'w' ? v : -v;
      }
    }
    if (wBishops >= 2) score += 28;
    if (bBishops >= 2) score -= 28;
    var cr = st.castling || {};
    if (cr.wK) score += 22;
    if (cr.wQ) score += 12;
    if (cr.bK) score -= 22;
    if (cr.bQ) score -= 12;
    // Penalize blocking unmoved center d/e pawns with own minor pieces directly ahead
    if (b[6][3] === 'wP' && b[5][3] && b[5][3][0] === 'w') score -= 24;
    if (b[6][4] === 'wP' && b[5][4] && b[5][4][0] === 'w') score -= 24;
    if (b[1][3] === 'bP' && b[2][3] && b[2][3][0] === 'b') score += 24;
    if (b[1][4] === 'bP' && b[2][4] && b[2][4][0] === 'b') score += 24;
    // Penalize awkward edge rook moves onto 2nd/7th rank (e.g. 2.Rh2)
    if (b[6][7] === 'wR' || b[6][0] === 'wR') score -= 42;
    if (b[1][7] === 'bR' || b[1][0] === 'bR') score += 42;
    return score;
  }

  function evalForTurn(st) {
    return evalWhite(st) * (st.turn === 'w' ? 1 : -1);
  }

  function moveHeuristicScore(st, uci) {
    var frc = sqToRC(uci.slice(0, 2)), trc = sqToRC(uci.slice(2, 4));
    var p = st.board[frc[0]][frc[1]];
    var target = st.board[trc[0]][trc[1]];
    var score = 0;
    if (target) score += 1000 + PIECE_VAL[target[1]] * 10 - PIECE_VAL[p[1]];
    if (p[1] === 'P' && (trc[0] === 0 || trc[0] === 7)) score += 900;
    if (p[1] === 'K' && Math.abs(trc[1] - frc[1]) === 2) score += 120;
    if ((trc[0] === 3 || trc[0] === 4) && (trc[1] === 3 || trc[1] === 4)) score += 30;
    return score;
  }

  function orderedLegalMoves(st, pvHint) {
    var legal = allLegalMoves(st);
    var scored = [];
    for (var i = 0; i < legal.length; i++) {
      var uci = legal[i];
      var s = moveHeuristicScore(st, uci);
      if (uci === pvHint) s += 50000;
      scored.push({ uci: uci, s: s });
    }
    scored.sort(function (a, b) { return b.s - a.s; });
    return scored.map(function (x) { return x.uci; });
  }

  function quiesce(st, alpha, beta, depth) {
    var inChk = inCheck(st, st.turn);
    if (!inChk) {
      var stand = evalForTurn(st);
      if (stand >= beta) return beta;
      if (alpha < stand) alpha = stand;
      if (depth <= 0) return alpha;
    } else if (depth <= -1) {
      return evalForTurn(st);
    }

    var moves = orderedLegalMoves(st, null);
    if (inChk && moves.length === 0) return -20000 - Math.max(0, depth);

    for (var i = 0; i < moves.length; i++) {
      var uci = moves[i];
      var frc = sqToRC(uci.slice(0, 2)), trc = sqToRC(uci.slice(2, 4));
      var p = st.board[frc[0]][frc[1]];
      var isCap = !!st.board[trc[0]][trc[1]] || (p && p[1] === 'P' && frc[1] !== trc[1]);
      var isPromo = p && p[1] === 'P' && (trc[0] === 0 || trc[0] === 7);
      if (!inChk && !isCap && !isPromo) continue;
      var ns = applyRaw(st, frc[0], frc[1], trc[0], trc[1], 'q');
      var score = -quiesce(ns, -beta, -alpha, depth - 1);
      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  }

  function negamax(st, depth, alpha, beta, pvOut) {
    var moves = orderedLegalMoves(st, null);
    if (moves.length === 0) {
      return inCheck(st, st.turn) ? (-20000 - depth) : 0;
    }
    if (depth <= 0) {
      return quiesce(st, alpha, beta, 2);
    }
    var bestScore = -999999;
    var bestPv = [];
    for (var i = 0; i < moves.length; i++) {
      var uci = moves[i];
      var frc = sqToRC(uci.slice(0, 2)), trc = sqToRC(uci.slice(2, 4));
      var ns = applyRaw(st, frc[0], frc[1], trc[0], trc[1], 'q');
      var childPv = pvOut ? [] : null;
      var score = -negamax(ns, depth - 1, -beta, -alpha, childPv);
      if (score > bestScore) {
        bestScore = score;
        if (pvOut) bestPv = [uci].concat(childPv);
      }
      if (score > alpha) alpha = score;
      if (alpha >= beta) break;
    }
    if (pvOut) {
      for (var k = 0; k < bestPv.length; k++) pvOut.push(bestPv[k]);
    }
    return bestScore;
  }

  function evaluateAfterMove(stAfter, depth) {
    var pv = depth > 1 ? [] : null;
    var turnScore = -negamax(stAfter, Math.max(0, depth - 1), -30000, 30000, pv);
    var whiteCp = turnScore * (stAfter.turn === 'w' ? -1 : 1);
    return { turnScoreCp: turnScore, whiteCp: whiteCp, pv: pv || [] };
  }

  function analyzePosition(stBefore, depth, extraUci) {
    var targetDepth = depth || 3;
    var moves = orderedLegalMoves(stBefore, null);
    var ranked = [];
    for (var i = 0; i < moves.length; i++) {
      var uci = moves[i];
      var ns = applyUciMove(stBefore, uci);
      var res2 = evaluateAfterMove(ns, Math.min(2, targetDepth));
      ranked.push({
        uci: uci,
        stAfter: ns,
        turnScoreCp: res2.turnScoreCp,
        whiteCp: res2.whiteCp,
        pv: [uci].concat(res2.pv.slice(0, 3))
      });
    }
    ranked.sort(function (a, b) { return b.turnScoreCp - a.turnScoreCp; });
    if (targetDepth <= 2) return ranked;

    var refineN = Math.min(6, ranked.length);
    for (var k = 0; k < ranked.length; k++) {
      if (k < refineN || (extraUci && ranked[k].uci === extraUci)) {
        var resD = evaluateAfterMove(ranked[k].stAfter, targetDepth);
        ranked[k].turnScoreCp = resD.turnScoreCp;
        ranked[k].whiteCp = resD.whiteCp;
        ranked[k].pv = [ranked[k].uci].concat(resD.pv.slice(0, 3));
      }
    }
    ranked.sort(function (a, b) { return b.turnScoreCp - a.turnScoreCp; });
    return ranked;
  }

  function winChance(whiteCp) {
    return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * whiteCp)) - 1);
  }

  function formatPlayerEval(playerCp) {
    if (Math.abs(playerCp) >= 18000) {
      return (playerCp > 0 ? '+' : '-') + '#';
    }
    var p = Math.round(playerCp / 10) / 10;
    if (p === 0) return '0.0';
    return (p > 0 ? '+' : '') + p.toFixed(1);
  }

  function formatEvalCp(whiteCp) {
    return formatPlayerEval(whiteCp);
  }

  function describeEval(playerCp, lang) {
    var en = lang === 'en';
    if (playerCp >= 350) return en ? 'winning advantage' : 'ventaja decisiva';
    if (playerCp >= 150) return en ? 'clearly better' : 'claramente mejor';
    if (playerCp >= 55) return en ? 'slightly better' : 'algo mejor';
    if (playerCp > -55) return en ? 'roughly equal' : 'más o menos igualado';
    if (playerCp > -125) return en ? 'slightly worse' : 'algo peor';
    if (playerCp > -350) return en ? 'clearly worse' : 'claramente peor';
    return en ? 'losing position' : 'ventaja decisiva rival';
  }

  function explainMoveReason(stBefore, bestUci, bestSan, lang) {
    var en = lang === 'en';
    var fromSq = bestUci.slice(0, 2), toSq = bestUci.slice(2, 4);
    var frc = sqToRC(fromSq), trc = sqToRC(toSq);
    var piece = stBefore.board[frc[0]][frc[1]];
    var target = stBefore.board[trc[0]][trc[1]];
    var cleanSan = bestSan.replace(/[+#]$/, '');
    if (target || (piece && piece[1] === 'P' && frc[1] !== trc[1])) {
      return en ? (cleanSan + ' wins material or resolves central tension.') : (cleanSan + ' captura material o despeja el centro.');
    }
    if (piece && piece[1] === 'K' && Math.abs(trc[1] - frc[1]) === 2) {
      return en ? (cleanSan + ' tucks the king to safety and brings the rook into play.') : (cleanSan + ' resguarda al rey y activa la torre.');
    }
    if (/\+$/.test(bestSan)) {
      return en ? (cleanSan + ' gives check and gains a key tempo.') : (cleanSan + ' da jaque y gana la iniciativa.');
    }
    if (piece && (piece[1] === 'N' || piece[1] === 'B')) {
      var homeRow = piece[0] === 'w' ? 7 : 0;
      if (frc[0] === homeRow) {
        return en ? (cleanSan + ' brings a new piece into the game.') : (cleanSan + ' saca una pieza nueva al juego.');
      }
      return en ? (cleanSan + ' activates a minor piece toward the center.') : (cleanSan + ' coloca mejor la pieza en casilla activa.');
    }
    if (piece && piece[1] === 'P' && ['d4','e4','d5','e5','c4','c5'].indexOf(toSq) !== -1) {
      return en ? (cleanSan + ' stakes a claim in the center.') : (cleanSan + ' lucha por el control del centro.');
    }
    return en ? (cleanSan + ' improves piece coordination and solidity.') : (cleanSan + ' coordina mejor tus piezas y mantiene la solidez.');
  }

  function formatChipLabel(mv, forceNum, suf) {
    var san = mv['san' + suf];
    if (forceNum || mv.color === 'w') {
      return mv.number + (mv.color === 'w' ? '.' : '...') + san;
    }
    return san;
  }

  var STRINGS = {
    es: {
      docTitle: 'Aperturas de Ajedrez · Todologo',
      brandSub: 'Juega la apertura hasta que falles. Luego, otra vez.',
      home: 'Volver al catálogo de Todologo',
      railTitle: 'Familias de apertura',
      railPath: '90%+ en Examen marca la familia como completada.',
      langHeading: 'Idioma',
      modeHeading: 'Modo',
      modes: { play: 'Partida', study: 'Estudiar', practice: 'Practicar', test: 'Examen' },
      modeHints: {
        play: 'Juega las primeras jugadas contra el motor hasta cometer un error o dejar pasar una oportunidad.',
        study: 'Recorre jugada a jugada cada apertura, gira el tablero y observa trampas típicas.',
        practice: 'Entrena moviendo piezas en el tablero o eligiendo 1–4 con explicación inmediata.',
        test: 'Ronda de 12 preguntas cronometrada con nombres ocultos antes de responder.'
      },
      playUI: {
        thisGame: 'Esta partida',
        mistakesTitle: 'Errores por corregir',
        mistakesEmpty: 'Sin errores pendientes. Cuando falles una posición, volverá aquí para repetirla.',
        mistakesCount: '{n} posiciones en las que fallaste. Cada una vuelve en partidas posteriores y sale de esta lista cuando la juegas bien.',
        playColorHeading: 'Jugar con',
        colors: { white: 'Blancas', black: 'Negras', any: 'Cualquiera' },
        rivalHeading: 'Rival',
        rivals: { novice: 'Principiante', club: 'Jugador de club', master: 'Maestro' },
        rivalHints: {
          novice: 'Comete errores tácticos con frecuencia: busca castigarlos sin piedad.',
          club: 'Conoce las líneas principales, juega alguna dudosa y falla de vez en cuando.',
          master: 'Teoría sólida y luego las mejores jugadas del motor. No te regala nada: no falles.'
        },
        stopHeading: 'Parar la partida con',
        stops: { blunder: 'Errores graves', mistake: 'Errores', inaccuracy: 'Imprecisiones' },
        stopHints: {
          blunder: 'Solo errores graves paran la partida (~2+ peones o pieza perdida).',
          mistake: 'Un error para la partida: una jugada que regala más o menos un peón o más.',
          inaccuracy: 'Estricto: incluso imprecisiones posicionales (~0.45p) paran la partida.'
        },
        openingHeading: 'Apertura',
        openingAny: 'Cualquier apertura',
        openingAnyHint: 'Eliges tus propias jugadas desde la primera; el rival varía sus respuestas.',
        openingLockHint: 'ECO {eco} · La apertura elegida guía los primeros compases.',
        openingGroups: {
          '1.e4 e5': '1.e4 e5',
          '1.e4, other replies': '1.e4, otras respuestas',
          '1.d4 d5': '1.d4 d5',
          '1.d4, other replies': '1.d4, otras respuestas',
          'Other first moves': 'Otras primeras jugadas'
        },
        durationHeading: 'Duración',
        dur8: '8 jugadas',
        newGame: 'Nueva partida',
        tryAgain: 'Reintentar',
        nextMistake: 'Siguiente error',
        backToPlay: 'Volver a jugar',
        fixBtn: 'Corregir errores ({n})',
        keysHint: 'N nueva partida · T reintentar · ← → recorrer una línea · F girar el tablero',
        statClean: 'Partidas limpias',
        statStreak: 'Racha',
        statBest: 'Mejor',
        eyebrowTurn: 'TE TOCA · JUGADA {m} DE {t}',
        eyebrowFix: 'CORREGIR ERROR · {i} DE {n}',
        eyebrowFixed: '¡CORREGIDA!',
        eyebrowStop: '{kind} · JUGADA {m}',
        eyebrowClean: '¡PARTIDA LIMPIA! · {m} JUGADAS',
        grades: { blunder: 'ERROR GRAVE', mistake: 'ERROR', inaccuracy: 'IMPRECISIÓN' },
        missedChance: 'OPORTUNIDAD PERDIDA',
        checkmate: '¡JAQUE MATE!',
        checkmated: 'MATE EN CONTRA',
        mateFinish: 'Remataste la apertura con jaque mate.',
        youWereMated: 'El motor dio jaque mate en la apertura.',
        stopTitle: 'Tras {move}: {desc}',
        evalCompare: 'Con {best}: {bestDesc} ({bestEval}). Tras {played}: {playedDesc} ({playedEval}).',
        engineReply: 'La respuesta del motor a {played} es {reply}.',
        youPlayedRow: 'JUGASTE',
        betterRow: 'MEJOR',
        metaSub: '{eco} · {side} contra {rival}',
        beforeOpening: 'Antes de la apertura',
        findBetter: 'Encuentra algo mejor que {move}',
        fixedTitle: '{now} es la jugada',
        fixedMeta: 'La última vez jugaste {old} · Quedan {n}',
        fixedNoneLeft: 'La última vez jugaste {old} · Lista limpia',
        noticeSamePos: 'Misma posición: busca la continuación más precisa.',
        whiteSide: 'Blancas',
        blackSide: 'Negras',
        cleanMsg: 'Superaste las {t} jugadas sin errores. Racha: {s}.',
        detectInit: 'Mueve una pieza para empezar'
      },
      taskHeading: 'Tipo de reto',
      tasks: { mix: 'Mezcla', board: 'Tablero', identify: 'Reconocer', plan: 'Plan' },
      taskHints: {
        mix: 'Alterna jugadas en tablero, reconocimiento de apertura/ECO y planes estratégicos.',
        board: 'Haz clic en origen → destino sobre el tablero (o elige 1–4) para jugar la línea teórica.',
        identify: 'Identifica qué apertura y código ECO corresponde a la posición del tablero.',
        plan: 'Elige la estrategia o trampa táctica correcta de la posición actual.'
      },
      statAccLabel: 'Precisión',
      statTimeLabel: 'Tiempo',
      statStreakLabel: 'Racha',
      actions: {
        prev: 'Ant.', next: 'Sig.', goPractice: 'Practicar este bloque →',
        nextQ: 'Siguiente', viewSummary: 'Ver resumen',
        clean: 'Vista limpia', cleanExit: 'Salir de vista limpia',
        restart: 'Reiniciar', settings: 'Ajustes', how: 'Cómo funciona',
        best: 'Mejor: ', bestNone: 'Sin marca aún',
        keysHint: 'Flechas navegan jugadas · F gira tablero · T trampa · 1–4 responden · Space siguiente'
      },
      ctrlStart: 'Inicio', ctrlPrev: 'Ant.', ctrlNext: 'Sig.', ctrlEnd: 'Fin',
      ctrlFlip: 'Girar', ctrlTrap: 'Ver trampa típica',
      startPosHint: 'Posición inicial · Pulsa «Sig.» (→) para ver por qué empieza cada apertura.',
      ideaLbl: 'Plan estratégico',
      structLbl: 'Estructura de peones y casillas clave',
      trapLbl: 'Trampa / Error típico a evitar',
      studyEyebrow: 'Estudio teórico',
      qBoardEyebrow: 'Juega en el tablero',
      qIdentifyEyebrow: 'Reconoce la apertura',
      qPlanEyebrow: 'Plan y trampa',
      qBoardWhite: 'Juegan Blancas — mueve la jugada teórica',
      qBoardBlack: 'Juegan Negras — mueve la jugada teórica',
      qBoardMeta: 'Haz clic en la pieza y su destino en el tablero, o usa 1–4.',
      qIdentifyTitle: '¿Qué apertura y código ECO muestra el tablero?',
      qPlanTitle: '¿Qué plan estratégico o idea domina esta posición?',
      rightMsg: '¡Correcto! ', wrongMsg: 'Era ',
      roundDone: 'Ronda completada', roundMeta: 'aciertos en ',
      passedMsg: 'Familia dominada (≥90%).',
      retryMsg: 'Necesitas 90%+ en Examen para completar este bloque.',
      creditText: '3,177 aperturas Lichess (CC0) · Libro evaluado Stockfish 19 (prof. 16) + 12 lecciones guiadas',
      introTitle: 'Juega la apertura hasta que falles',
      introBody1: 'Juegas las primeras jugadas de una partida contra el motor. En cuanto cometes un error, o dejas pasar una oportunidad del rival, la partida se para:',
      introList: [
        '<li><b>1. Juega.</b> Toca una pieza y luego la casilla adonde va (o arrástrala). Las 3,177 aperturas conocidas muestran su nombre y ECO al instante.</li>',
        '<li><b>2. Te paran.</b> Ves la jugada que hiciste frente a la mejor, la barra de valoración del motor y las líneas clicables.</li>',
        '<li><b>3. Otra vez.</b> Empieza una nueva partida, pulsa <b>Reintentar [T]</b> o corrige tus errores guardados. También tienes <b>Estudiar</b>, <b>Practicar</b> y <b>Examen</b>.</li>'
      ],
      introGo: 'Empezar'
    },
    en: {
      docTitle: 'Chess Opening Trainer · Todologo',
      brandSub: 'Play the opening until you slip. Then go again.',
      home: 'Back to Todologo catalog',
      railTitle: 'Opening Families',
      railPath: 'Score 90%+ in Test mode to mark a family mastered.',
      langHeading: 'Language',
      modeHeading: 'Mode',
      modes: { play: 'Play', study: 'Study', practice: 'Practice', test: 'Test' },
      modeHints: {
        play: 'Play opening moves against the engine until you blunder or miss an opponent mistake.',
        study: 'Step through mainlines move-by-move, flip the board, and inspect typical traps.',
        practice: 'Play moves directly on the 8×8 board or use 1–4 with full immediate commentary.',
        test: 'Timed 12-question assessment with opening names hidden until answered.'
      },
      playUI: {
        thisGame: 'This game',
        mistakesTitle: 'Mistakes to fix',
        mistakesEmpty: 'No pending mistakes. Failed positions return here until you play them accurately.',
        mistakesCount: '{n} positions you slipped in. Each returns in future runs and clears once you play it accurately.',
        playColorHeading: 'Play as',
        colors: { white: 'White', black: 'Black', any: 'Any' },
        rivalHeading: 'Opponent',
        rivals: { novice: 'Beginner', club: 'Club player', master: 'Master' },
        rivalHints: {
          novice: 'Makes frequent tactical slips — spot and punish them immediately.',
          club: 'Knows mainlines, plays occasional dubious moves, and slips from time to time.',
          master: 'Solid theory followed by top engine replies. Forgives nothing.'
        },
        stopHeading: 'Stop the game on',
        stops: { blunder: 'Blunders', mistake: 'Mistakes', inaccuracy: 'Inaccuracies' },
        stopHints: {
          blunder: 'Only serious blunders stop the game (~2+ pawns or piece loss).',
          mistake: 'A mistake stops the game: a move that gives away roughly a pawn or more.',
          inaccuracy: 'Strict: even subtle inaccuracies (~0.45p) stop the game.'
        },
        openingHeading: 'Opening',
        openingAny: 'Any opening',
        openingAnyHint: 'Play freely from move 1; the engine varies theoretical replies.',
        openingLockHint: 'ECO {eco} · Chosen opening guides the early move order.',
        openingGroups: {
          '1.e4 e5': '1.e4 e5',
          '1.e4, other replies': '1.e4, other replies',
          '1.d4 d5': '1.d4 d5',
          '1.d4, other replies': '1.d4, other replies',
          'Other first moves': 'Other first moves'
        },
        durationHeading: 'Length',
        dur8: '8 moves',
        newGame: 'New game',
        tryAgain: 'Try again',
        nextMistake: 'Next mistake',
        backToPlay: 'Back to play',
        fixBtn: 'Fix mistakes ({n})',
        keysHint: 'N new game · T retry · ← → step line · F flip board',
        statClean: 'Clean games',
        statStreak: 'Streak',
        statBest: 'Best',
        eyebrowTurn: 'YOUR TURN · MOVE {m} OF {t}',
        eyebrowFix: 'FIX MISTAKE · {i} OF {n}',
        eyebrowFixed: 'FIXED!',
        eyebrowStop: '{kind} · MOVE {m}',
        eyebrowClean: 'CLEAN GAME! · {m} MOVES',
        grades: { blunder: 'BLUNDER', mistake: 'MISTAKE', inaccuracy: 'INACCURACY' },
        missedChance: 'MISSED CHANCE',
        checkmate: 'CHECKMATE!',
        checkmated: 'CHECKMATED',
        mateFinish: 'You finished the opening with checkmate.',
        youWereMated: 'You were checkmated in the opening.',
        stopTitle: 'After {move}: {desc}',
        evalCompare: 'With {best}: {bestDesc} ({bestEval}). After {played}: {playedDesc} ({playedEval}).',
        engineReply: 'The engine’s reply to {played} is {reply}.',
        youPlayedRow: 'YOU PLAYED',
        betterRow: 'BETTER',
        metaSub: '{eco} · {side} against {rival}',
        beforeOpening: 'Before opening name',
        findBetter: 'Find something better than {move}',
        fixedTitle: '{now} is the move',
        fixedMeta: 'Last time you played {old} · {n} left',
        fixedNoneLeft: 'Last time you played {old} · All clear',
        noticeSamePos: 'Same position: find the sharper continuation.',
        whiteSide: 'White',
        blackSide: 'Black',
        cleanMsg: 'Completed {t} moves cleanly. Streak: {s}.',
        detectInit: 'Play a move to start'
      },
      taskHeading: 'Challenge type',
      tasks: { mix: 'Mixed', board: 'Board', identify: 'Identify', plan: 'Plan' },
      taskHints: {
        mix: 'Alternates on-board moves, ECO recognition, and strategic planning questions.',
        board: 'Click piece → destination square right on the board (or press 1–4) to find theory.',
        identify: 'Identify which opening and ECO code matches the board position.',
        plan: 'Pick the soundest long-term strategic plan for the shown opening setup.'
      },
      statAccLabel: 'Accuracy',
      statTimeLabel: 'Time',
      statStreakLabel: 'Streak',
      actions: {
        prev: 'Prev', next: 'Next', goPractice: 'Practice this block →',
        nextQ: 'Next', viewSummary: 'View summary',
        clean: 'Clean view', cleanExit: 'Exit clean',
        restart: 'Restart', settings: 'Settings', how: 'Quick guide',
        best: 'Best: ', bestNone: 'No score yet',
        keysHint: 'Arrows step moves · F flips board · T trap · 1–4 answer · Space next'
      },
      ctrlStart: 'Start', ctrlPrev: 'Prev', ctrlNext: 'Next', ctrlEnd: 'End',
      ctrlFlip: 'Flip', ctrlTrap: 'Show typical trap',
      startPosHint: 'Starting position · Press Next (→) to step through the opening moves and reasoning.',
      ideaLbl: 'Strategic plan',
      structLbl: 'Pawn structure & key squares',
      trapLbl: 'Trap / Common blunder to avoid',
      studyEyebrow: 'Opening study',
      qBoardEyebrow: 'Play on the board',
      qIdentifyEyebrow: 'Identify the opening',
      qPlanEyebrow: 'Strategic plan',
      qBoardWhite: 'White to move — play the theoretical move',
      qBoardBlack: 'Black to move — play the theoretical move',
      qBoardMeta: 'Click piece then target square on the board, or press 1–4.',
      qIdentifyTitle: 'Which opening and ECO code is on the board?',
      qPlanTitle: 'Which strategic plan best fits this opening structure?',
      rightMsg: 'Correct! ', wrongMsg: 'Answer: ',
      roundDone: 'Round complete', roundMeta: 'correct in ',
      passedMsg: 'Family mastered (≥90%).',
      retryMsg: 'Score 90%+ in Test mode to mark this block mastered.',
      creditText: '3,177 Lichess openings (CC0) · Stockfish 19 depth-16 book + 12 guided lessons',
      introTitle: 'Play the opening until you slip',
      introBody1: 'You play the opening moves against a chess engine. The moment you make a mistake or miss a chance the opponent gave you, the run stops:',
      introList: [
        '<li><b>1. Play.</b> Click or drag pieces. All 3,177 known openings appear live as you play.</li>',
        '<li><b>2. Stopped on slip.</b> See your move vs. the engine’s best, the evaluation bar, and clickable continuation lines.</li>',
        '<li><b>3. Go again.</b> Start a new game, hit <b>Try again [T]</b>, or fix your saved mistakes. Also includes <b>Study</b>, <b>Practice</b>, and <b>Test</b>.</li>'
      ],
      introGo: 'Start'
    }
  };

  var state = {
    block: STORE.get('block', 'all'),
    mode: STORE.get('mode', 'study'),
    task: STORE.get('task', 'mix'),
    openingId: STORE.get('openingId', 'italiana'),
    ply: 6,
    showTrap: false,
    flipped: false,
    selSq: null,
    question: null,
    answered: false,
    lastOk: false,
    streak: 0,
    totalCount: 0,
    rightCount: 0,
    roundTarget: 12,
    roundAsk: 0,
    roundRight: 0,
    roundStart: 0,
    frozenSec: null,
    bests: STORE.get('bests', {}),
    flashTimer: null,
    play: {
      color: STORE.get('playColor', 'white'),
      rival: STORE.get('rival', 'club'),
      stopOn: STORE.get('stopOn', 'mistake'),
      openingFilter: STORE.get('openingFilter', 'any'),
      duration: Number(STORE.get('duration', 12)) || 12,
      cleanGames: Number(STORE.get('cleanGames', 0)) || 0,
      totalGames: Number(STORE.get('totalGames', 0)) || 0,
      streak: Number(STORE.get('playStreak', 0)) || 0,
      best: Number(STORE.get('playBest', 0)) || 0,
      mistakes: STORE.get('mistakes', [])
    },
    game: null
  };

  if (!Array.isArray(state.play.mistakes)) state.play.mistakes = [];

  if (!BLOCKS.some(function (b) { return b.id === state.block; })) state.block = 'all';
  if (!BY_ID[state.openingId]) state.openingId = 'italiana';

  var $ = function (id) { return document.getElementById(id); };
  function S() { return STRINGS[LANG] || STRINGS.es; }
  function opName(o) { return LANG === 'en' ? o.en : o.es; }
  function activePool() {
    var b = BLOCKS.find(function (x) { return x.id === state.block; }) || BLOCKS[0];
    return OPENINGS.filter(b.match);
  }
  function shuffle(a) {
    var arr = a.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function setLang(l) {
    LANG = l === 'en' ? 'en' : 'es';
    STORE.set('lang', LANG);
    try { localStorage.setItem('todologo.lang', LANG); } catch (_) {}
    applyStaticLabels();
    renderRail();
    renderStage();
  }

  function elapsedSec() {
    if (state.frozenSec != null) return state.frozenSec;
    if (!state.roundStart || state.mode === 'study') return 0;
    return (Date.now() - state.roundStart) / 1000;
  }
  function fmtClock(sec) {
    sec = Math.max(0, Math.floor(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  setInterval(function () {
    if ((state.mode === 'practice' || state.mode === 'test') && state.roundStart && state.frozenSec == null) {
      $('sTime').textContent = fmtClock(elapsedSec());
    }
  }, 400);

  function populateOpeningSelect() {
    var sel = $('openingSel');
    if (!sel) return;
    var pui = S().playUI;
    var groups = pui.openingGroups || {};
    var prev = state.play.openingFilter || 'any';
    sel.innerHTML = '';
    var anyOpt = document.createElement('option');
    anyOpt.value = 'any';
    anyOpt.textContent = pui.openingAny;
    sel.appendChild(anyOpt);

    if (MENU_OPENINGS.length) {
      var seenGroups = [];
      MENU_OPENINGS.forEach(function (o) {
        if (seenGroups.indexOf(o.group) === -1) seenGroups.push(o.group);
      });
      seenGroups.forEach(function (grpName) {
        var og = document.createElement('optgroup');
        og.label = groups[grpName] || grpName;
        MENU_OPENINGS.filter(function (o) { return o.group === grpName; }).forEach(function (o) {
          var opt = document.createElement('option');
          opt.value = o.name;
          opt.textContent = o.name;
          og.appendChild(opt);
        });
        sel.appendChild(og);
      });
      if (MENU_BY_NAME[prev]) {
        sel.value = prev;
      } else if (BY_ID[prev] && MENU_BY_NAME[BY_ID[prev].en]) {
        sel.value = BY_ID[prev].en;
      } else {
        sel.value = 'any';
      }
      return;
    }

    OPENINGS.forEach(function (o) {
      var opt = document.createElement('option');
      opt.value = o.id;
      opt.textContent = o.eco + ' · ' + opName(o);
      sel.appendChild(opt);
    });
    sel.value = BY_ID[prev] ? prev : 'any';
  }

  function renderPlayRail() {
    var s = S().playUI;
    var g = state.game;
    $('thisGameTitle').textContent = s.thisGame;
    $('mistakesTitle').textContent = s.mistakesTitle;

    var movesBox = $('playMoves');
    movesBox.innerHTML = '';
    if (!g || !g.moves.length) {
      $('playOpName').textContent = s.detectInit;
      $('playOpEco').textContent = 'ECO —';
    } else {
      var uciList = g.moves.map(function (m, idx) {
        return (g.stopped && g.stopped.stopPly === idx + 1) ? null : m.uci;
      }).filter(Boolean);
      var det = detectOpening(uciList.length ? uciList : g.moves.map(function (m) { return m.uci; }));
      $('playOpName').textContent = LANG === 'en' ? det.en : det.es;
      $('playOpEco').textContent = det.eco || '—';

      var suf = LANG === 'en' ? 'En' : 'Es';
      var i = 0;
      while (i < g.moves.length) {
        var m = g.moves[i];
        var nEl = document.createElement('span');
        nEl.className = 'mv-n';
        nEl.textContent = String(m.number || (Math.floor(i / 2) + 1)) + '.';
        movesBox.appendChild(nEl);

        if (i === 0 && m.color === 'b') {
          var dots = document.createElement('span');
          dots.className = 'm setup mv-btn is-setup';
          dots.textContent = '…';
          movesBox.appendChild(dots);
        }

        function appendMoveCell(plyIdx) {
          var mv = g.moves[plyIdx];
          var isStopMove = !!(g.stopped && g.stopped.stopPly === plyIdx + 1);
          var answered = plyIdx < g.moves.length - 1 || !!g.stopped;
          var isSlip = mv.by === 'rival' && (mv.loss || 0) >= 15 && answered;

          var mb = document.createElement('button');
          mb.type = 'button';
          mb.className = 'mv-btn';
          if (mv.by === 'setup') mb.classList.add('is-setup');
          if (isSlip) mb.classList.add('is-slip');
          if (g.cursor === plyIdx + 1 && !g.pvPreview && !g.stopped) mb.classList.add('is-cur');
          if (isStopMove) mb.classList.add('is-stop');
          mb.textContent = mv['san' + suf] + (isSlip ? '?' : '');
          mb.addEventListener('click', function () {
            g.pvPreview = null;
            g.historyInspect = true;
            g.cursor = plyIdx + 1;
            state.selSq = null;
            renderPlayRail();
            renderStage();
          });
          movesBox.appendChild(mb);
        }

        if (m.color === 'b') {
          appendMoveCell(i);
          i++;
        } else {
          appendMoveCell(i);
          i++;
          if (i < g.moves.length && g.moves[i].color === 'b') {
            appendMoveCell(i);
            i++;
          } else {
            movesBox.appendChild(document.createElement('span'));
          }
        }
      }
    }

    var mCount = state.play.mistakes.length;
    $('mistakesDesc').textContent = mCount
      ? s.mistakesCount.replace('{n}', String(mCount))
      : s.mistakesEmpty;
    var btnTxt = s.fixBtn.replace('{n}', String(mCount));
    [$('fixMistakesLeftBtn'), $('fixMistakesBtn')].forEach(function (btn) {
      if (!btn) return;
      btn.textContent = btnTxt;
      btn.disabled = mCount === 0;
    });
  }

  function applyStaticLabels() {
    var s = S();
    var p = s.playUI;
    var isPlay = state.mode === 'play';
    document.body.classList.toggle('mode-play', isPlay);
    document.documentElement.lang = LANG;
    document.title = s.docTitle;
    $('brandMark').innerHTML = LANG === 'en'
      ? 'CHESS <span>OPENINGS</span><sup>T015</sup>'
      : 'APERTURAS <span>AJEDREZ</span><sup>T015</sup>';
    $('brandSub').textContent = s.brandSub;
    $('homeLink').setAttribute('aria-label', s.home);
    $('railTitle').textContent = s.railTitle;
    $('railPath').textContent = s.railPath;
    $('langHeading').textContent = s.langHeading;
    $('langSel').value = LANG;
    $('modeHeading').textContent = s.modeHeading;
    $('taskHeading').textContent = s.taskHeading;
    $('cleanBtn').textContent = s.actions.clean;
    if ($('cleanPlayBtn')) $('cleanPlayBtn').textContent = s.actions.clean;
    $('cleanExit').textContent = s.actions.cleanExit;
    $('restartBtn').textContent = s.actions.restart;
    $('settingsBtn').textContent = s.actions.settings;
    $('howBtn').textContent = s.actions.how;
    $('keysHint').textContent = s.actions.keysHint;
    $('creditText').textContent = s.creditText;
    $('introTitle').textContent = s.introTitle;
    $('introBody1').innerHTML = s.introBody1;
    $('introList').innerHTML = s.introList.join('');
    $('introGo').textContent = s.introGo;

    $('rail').hidden = isPlay;
    $('playRailCards').hidden = !isPlay;
    $('taskSection').hidden = isPlay;
    $('studyActionsSection').hidden = isPlay;
    $('playSettings').hidden = !isPlay;

    Array.prototype.forEach.call($('modeSeg').querySelectorAll('button'), function (b) {
      var v = b.getAttribute('data-v');
      b.textContent = s.modes[v] || v;
      b.setAttribute('aria-pressed', state.mode === v ? 'true' : 'false');
    });
    $('modeHint').textContent = s.modeHints[state.mode] || '';

    Array.prototype.forEach.call($('taskSeg').querySelectorAll('button'), function (b) {
      var v = b.getAttribute('data-v');
      b.textContent = s.tasks[v] || v;
      b.setAttribute('aria-pressed', state.task === v ? 'true' : 'false');
    });
    $('taskHint').textContent = s.taskHints[state.task] || '';

    // Play-mode panel labels & segments
    $('playColorHeading').textContent = p.playColorHeading;
    Array.prototype.forEach.call($('playColorSeg').querySelectorAll('button'), function (b) {
      var v = b.getAttribute('data-v');
      b.textContent = p.colors[v] || v;
      b.setAttribute('aria-pressed', state.play.color === v ? 'true' : 'false');
    });
    $('rivalHeading').textContent = p.rivalHeading;
    Array.prototype.forEach.call($('rivalSeg').querySelectorAll('button'), function (b) {
      var v = b.getAttribute('data-v');
      b.textContent = p.rivals[v] || v;
      b.setAttribute('aria-pressed', state.play.rival === v ? 'true' : 'false');
    });
    $('rivalHint').textContent = p.rivalHints[state.play.rival] || '';
    $('stopOnHeading').textContent = p.stopHeading;
    Array.prototype.forEach.call($('stopOnSeg').querySelectorAll('button'), function (b) {
      var v = b.getAttribute('data-v');
      b.textContent = p.stops[v] || v;
      b.setAttribute('aria-pressed', state.play.stopOn === v ? 'true' : 'false');
    });
    $('stopOnHint').textContent = p.stopHints[state.play.stopOn] || '';
    $('openingFilterHeading').textContent = p.openingHeading;
    populateOpeningSelect();
    var selOpObj = getSelectedOpeningEntry(state.play.openingFilter);
    $('openingFilterHint').textContent = selOpObj ? p.openingLockHint.replace('{eco}', selOpObj.eco) : p.openingAnyHint;
    $('durationHeading').textContent = p.durationHeading;
    Array.prototype.forEach.call($('durationSeg').querySelectorAll('button'), function (b) {
      var v = Number(b.getAttribute('data-v'));
      b.textContent = v === 8 ? p.dur8 : String(v);
      b.setAttribute('aria-pressed', state.play.duration === v ? 'true' : 'false');
    });
    $('newGameBtn').textContent = p.newGame;
    $('playKeysHint').textContent = p.keysHint;

    updateStatsUI();
    if (isPlay) renderPlayRail();
  }

  function renderRail() {
    var box = $('railList');
    box.innerHTML = '';
    var nextAssigned = false;

    BLOCKS.forEach(function (b, idx) {
      var best = state.bests[b.id];
      var mastered = !!(best && best.pct >= 90);
      var statusCls = mastered ? 'done' : (!nextAssigned ? 'next' : '');
      if (!mastered && !nextAssigned) nextAssigned = true;
      var rightTxt = best ? (best.pct + '%') : String(OPENINGS.filter(b.match).length);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';
      btn.setAttribute('aria-pressed', state.block === b.id ? 'true' : 'false');
      btn.innerHTML =
        '<span><i>' + String(idx + 1).padStart(2, '0') + '</i>' + (LANG === 'en' ? b.en : b.es) + '</span>' +
        '<em class="' + statusCls + '">' + rightTxt + '</em>';

      btn.addEventListener('click', function () {
        state.block = b.id;
        STORE.set('block', b.id);
        var pool = activePool();
        if (pool.length && !pool.some(function (o) { return o.id === state.openingId; })) {
          state.openingId = pool[0].id;
          STORE.set('openingId', state.openingId);
        }
        state.showTrap = false;
        state.selSq = null;
        renderRail();
        updateStatsUI();
        if (state.mode === 'study') renderStage();
        else startRoundOrQuestion(true);
      });
      box.appendChild(btn);
    });
  }

  /* =====================================================================
   * BOARD RENDERING + SVG ARROWS
   * ===================================================================== */
  function sqCenterPct(sq, flipped) {
    var rc = sqToRC(sq);
    var dispC = flipped ? 7 - rc[1] : rc[1];
    var dispR = flipped ? 7 - rc[0] : rc[0];
    return [dispC * 12.5 + 6.25, dispR * 12.5 + 6.25];
  }

  function buildBoardDOM(boardState, opts) {
    var flipped = !!opts.flipped;
    var legalSet = Object.create(null);
    (opts.legalDests || []).forEach(function (sq) { legalSet[sq] = true; });
    var keySet = Object.create(null);
    (opts.keySquares || []).forEach(function (sq) { keySet[sq] = true; });

    var wrap = document.createElement('div');
    wrap.className = 'chess-board-wrap';

    var grid = document.createElement('div');
    grid.className = 'chess-board';

    var kInChk = inCheck(boardState, boardState.turn) ? findKing(boardState.board, boardState.turn) : null;
    var chkSq = kInChk ? rcToSq(kInChk[0], kInChk[1]) : null;
    var suppressClick = false;

    for (var dr = 0; dr < 8; dr++) {
      for (var dc = 0; dc < 8; dc++) {
        var r = flipped ? 7 - dr : dr;
        var c = flipped ? 7 - dc : dc;
        var sq = rcToSq(r, c);
        var piece = boardState.board[r][c];
        var isDark = (r + c) % 2 === 1;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sq' + (isDark ? ' dark' : '');
        btn.setAttribute('data-sq', sq);
        btn.setAttribute('aria-label', sq + (piece ? ' ' + piece : ''));

        if (chkSq === sq) btn.classList.add('is-check');
        if (boardState.lastMove && (boardState.lastMove.from === sq || boardState.lastMove.to === sq)) {
          btn.classList.add('is-last');
        }
        if (opts.selSq === sq) btn.classList.add('is-sel');
        if (keySet[sq]) btn.classList.add('is-key');
        if (opts.okSquares && opts.okSquares.indexOf(sq) !== -1) btn.classList.add('is-ok');
        if (opts.badSquares && opts.badSquares.indexOf(sq) !== -1) btn.classList.add('is-bad');
        if (piece) btn.classList.add('has-piece');

        if (dc === 0) {
          var rk = document.createElement('span');
          rk.className = 'sq-coord rank';
          rk.textContent = String(8 - r);
          btn.appendChild(rk);
        }
        if (dr === 7) {
          var fl = document.createElement('span');
          fl.className = 'sq-coord file';
          fl.textContent = FILES[c];
          btn.appendChild(fl);
        }

        if (piece) {
          var pWrap = document.createElement('span');
          pWrap.style.display = 'contents';
          pWrap.innerHTML = buildPieceSVG(piece);
          btn.appendChild(pWrap.firstChild);
        }

        if (legalSet[sq]) {
          var dot = document.createElement('span');
          dot.className = 'sq-dot';
          btn.appendChild(dot);
        }

        if (opts.onSquareClick) {
          (function (square) {
            btn.addEventListener('click', function () {
              if (suppressClick) { suppressClick = false; return; }
              opts.onSquareClick(square);
            });
          })(sq);
        }

        if (opts.onPieceDrop && piece && piece[0] === boardState.turn) {
          (function (fromSq, pc, cellBtn) {
            cellBtn.addEventListener('pointerdown', function (ev) {
              if (ev.button !== 0 && ev.pointerType === 'mouse') return;
              var targets = getLegalTargets(boardState, fromSq);
              if (!targets.length) return;
              var startX = ev.clientX, startY = ev.clientY;
              var dragging = false;
              var ghost = null;

              function cleanup() {
                document.removeEventListener('pointermove', onMove);
                document.removeEventListener('pointerup', onUp);
                document.removeEventListener('pointercancel', onCancel);
                cellBtn.classList.remove('is-drag-src');
                if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
              }
              function onMove(mvEv) {
                var dx = mvEv.clientX - startX, dy = mvEv.clientY - startY;
                if (!dragging && Math.hypot(dx, dy) >= 7) {
                  dragging = true;
                  cellBtn.classList.add('is-drag-src');
                  ghost = document.createElement('div');
                  ghost.className = 'piece-drag-ghost';
                  var rect = cellBtn.getBoundingClientRect();
                  ghost.style.width = Math.round(rect.width * 0.92) + 'px';
                  ghost.style.height = Math.round(rect.height * 0.92) + 'px';
                  ghost.innerHTML = buildPieceSVG(pc);
                  document.body.appendChild(ghost);
                  // Highlight legal targets immediately while dragging
                  Array.prototype.forEach.call(grid.querySelectorAll('.sq'), function (sqEl) {
                    var targetSq = sqEl.getAttribute('data-sq');
                    if (targets.indexOf(targetSq) !== -1 && !sqEl.querySelector('.sq-dot')) {
                      var dt = document.createElement('span');
                      dt.className = 'sq-dot';
                      sqEl.appendChild(dt);
                    }
                  });
                }
                if (dragging && ghost) {
                  ghost.style.left = mvEv.clientX + 'px';
                  ghost.style.top = mvEv.clientY + 'px';
                }
              }
              function onUp(upEv) {
                var wasDragging = dragging;
                cleanup();
                if (!wasDragging) return;
                suppressClick = true;
                setTimeout(function () { suppressClick = false; }, 60);
                var under = document.elementFromPoint(upEv.clientX, upEv.clientY);
                var sqBtn = under && under.closest ? under.closest('.sq') : null;
                var toSq = sqBtn ? sqBtn.getAttribute('data-sq') : null;
                if (toSq && targets.indexOf(toSq) !== -1) {
                  opts.onPieceDrop(fromSq, toSq);
                } else {
                  Array.prototype.forEach.call(grid.querySelectorAll('.sq-dot'), function (dEl) {
                    var host = dEl.parentNode;
                    if (host && !legalSet[host.getAttribute('data-sq')]) host.removeChild(dEl);
                  });
                }
              }
              function onCancel() { cleanup(); }
              document.addEventListener('pointermove', onMove);
              document.addEventListener('pointerup', onUp);
              document.addEventListener('pointercancel', onCancel);
            });
          })(sq, piece, btn);
        }

        grid.appendChild(btn);
      }
    }
    wrap.appendChild(grid);

    // Tactical / Theoretical Arrows SVG Overlay
    if (opts.arrows && opts.arrows.length) {
      var arrowsHtml = opts.arrows.map(function (ar, i) {
        var p1 = sqCenterPct(ar.from, flipped);
        var p2 = sqCenterPct(ar.to, flipped);
        var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
        var len = Math.hypot(dx, dy) || 1;
        var ux = dx / len, uy = dy / len;
        var sx = p1[0] + ux * 2.2, sy = p1[1] + uy * 2.2;
        var ex = p2[0] - ux * 3.0, ey = p2[1] - uy * 3.0;
        var col = ar.color || '#6fd0e8';
        return '<defs><marker id="chArr' + i + '" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto">' +
          '<path d="M0,1 L9,5 L0,9 z" fill="' + col + '"/></marker></defs>' +
          '<line x1="' + sx.toFixed(1) + '" y1="' + sy.toFixed(1) + '" x2="' + ex.toFixed(1) + '" y2="' + ey.toFixed(1) +
          '" stroke="' + col + '" stroke-width="2.1" stroke-linecap="round" opacity="0.88" marker-end="url(#chArr' + i + ')"/>';
      }).join('');
      var ov = document.createElement('span');
      ov.style.display = 'contents';
      ov.innerHTML = '<svg class="board-overlay" viewBox="0 0 100 100" aria-hidden="true">' + arrowsHtml + '</svg>';
      wrap.appendChild(ov.firstChild);
    }

    return wrap;
  }

  function buildTheoryInspector(o, boardCur, currentPly, trapActive) {
    var s = S();
    var pane = document.createElement('div');
    pane.className = 'theory-pane';

    var suf = LANG === 'en' ? 'En' : 'Es';
    var stripHtml = '';
    for (var i = 0; i < o.moves.length; i++) {
      if (i % 2 === 0) stripHtml += '<span class="move-num">' + (Math.floor(i / 2) + 1) + '.</span>';
      var mv = o.moves[i];
      var cls = 'mv-btn' + (!trapActive && currentPly === i + 1 ? ' is-cur' : '');
      stripHtml += '<button class="' + cls + '" type="button" data-ply="' + (i + 1) + '">' + mv['san' + suf].replace(/^\d+\.+/, '') + '</button>';
    }

    var whyHtml = '';
    if (trapActive && o.trap) {
      whyHtml = '<div class="why-box is-trap"><b>' + o.trap['blunderSan' + suf] + ' → ' + o.trap['refuteSan' + suf] + ':</b> ' + o.trap['trap' + suf] + '</div>';
    } else if (currentPly > 0 && o.moves[currentPly - 1]) {
      var cm = o.moves[currentPly - 1];
      whyHtml = '<div class="why-box"><b>' + cm['san' + suf] + ':</b> ' + cm['why' + suf] + '</div>';
    } else {
      whyHtml = '<div class="why-box">' + s.startPosHint + '</div>';
    }

    pane.innerHTML =
      '<div class="theory-head">' +
        '<h4>' + opName(o) + '</h4>' +
        '<span class="eco-badge">ECO ' + o.eco + '</span>' +
      '</div>' +
      '<div class="move-strip" id="moveStrip">' + stripHtml + '</div>' +
      whyHtml +
      '<div class="theory-grid">' +
        '<div class="theory-row"><b>' + s.ideaLbl + '</b>' + o['idea' + suf] + '</div>' +
        '<div class="theory-row"><b>' + s.structLbl + '</b>' + o['struct' + suf] + ' (' + o.keySquares.join(', ') + ')</div>' +
        '<div class="theory-row trap"><b>' + s.trapLbl + '</b>' + o.trap['trap' + suf] + '</div>' +
      '</div>';

    if (state.mode === 'study') {
      Array.prototype.forEach.call(pane.querySelectorAll('.mv-btn[data-ply]'), function (b) {
        b.addEventListener('click', function () {
          state.showTrap = false;
          state.ply = Number(b.getAttribute('data-ply'));
          state.selSq = null;
          renderStage();
        });
      });
    }

    return pane;
  }

  /* =====================================================================
   * PLAY MODE ("Juega la apertura hasta que falles") ENGINE & CONTROLLER
   * ===================================================================== */
  var STOP_THRESHOLDS = { blunder: 200, mistake: 100, inaccuracy: 50 };
  var rivalTimer = null;

  function clearRivalTimer() {
    if (rivalTimer) { clearTimeout(rivalTimer); rivalTimer = null; }
  }

  function savePlayStats() {
    STORE.set('cleanGames', state.play.cleanGames);
    STORE.set('totalGames', state.play.totalGames);
    STORE.set('playStreak', state.play.streak);
    STORE.set('playBest', state.play.best);
  }

  function buildContinuationLine(baseSt, firstUci, maxPlies, baseMoveNumber) {
    var limit = maxPlies || 7;
    var states = [baseSt];
    var moves = [];
    var cur = baseSt;
    var baseNo = baseMoveNumber != null ? baseMoveNumber : 1;
    var uci = firstUci;
    for (var i = 0; i < limit && uci; i++) {
      try {
        var sanEs = moveToSan(cur, uci, 'es');
        var sanEn = moveToSan(cur, uci, 'en');
        var color = cur.turn;
        var curMoveNo = baseNo + Math.floor((i + (baseSt.turn === 'b' ? 1 : 0)) / 2);
        cur = applyUciMove(cur, uci);
        moves.push({ uci: uci, sanEs: sanEs, sanEn: sanEn, color: color, number: curMoveNo, afterState: cur });
        states.push(cur);

        if (i + 1 >= limit) break;
        var legalNext = allLegalMoves(cur);
        if (!legalNext.length) break;

        var bk = lookupBookPosition(cur);
        if (bk && bk.moves.length) {
          uci = bk.moves[0].uci;
        } else {
          var rankedNext = analyzePosition(cur, 2);
          uci = rankedNext.length ? rankedNext[0].uci : null;
        }
      } catch (_) { break; }
    }
    return { states: states, moves: moves };
  }

  function weightedBookChoice(cands, favorBest) {
    if (!cands.length) return null;
    if (cands.length === 1) return cands[0];
    var totalW = 0;
    var weights = cands.map(function (c) {
      var w = favorBest
        ? (Math.sqrt(c.count || 1) + 1) / (1 + (c.loss || 0) * 0.08)
        : (1 + (c.count || 0) * 0.15);
      totalW += w;
      return w;
    });
    var r = Math.random() * totalW;
    for (var i = 0; i < cands.length; i++) {
      r -= weights[i];
      if (r <= 0) return cands[i];
    }
    return cands[0];
  }

  function pickRivalMove(st, uciHist, rivalLevel, openingFilter, revisitPath) {
    // 1. If revisiting a saved mistake line and opponent can steer straight into it
    if (revisitPath && Array.isArray(revisitPath) && uciHist.length < revisitPath.length) {
      var revMatch = true;
      for (var r = 0; r < uciHist.length; r++) {
        if (revisitPath[r] !== uciHist[r]) { revMatch = false; break; }
      }
      if (revMatch) {
        var targetUci = revisitPath[uciHist.length];
        var revLegal = allLegalMoves(st);
        if (revLegal.indexOf(targetUci) !== -1) {
          var bkRev = lookupBookPosition(st);
          var revMoveObj = bkRev && bkRev.moves.find(function (m) { return m.uci === targetUci; });
          var revLoss = revMoveObj ? revMoveObj.loss : 0;
          return { uci: targetUci, loss: revLoss, blundered: revLoss >= 80 };
        }
      }
    }

    // 2. If user locked a specific opening in #openingSel and we're still within its move order
    var filterOp = getSelectedOpeningEntry(openingFilter);
    if (filterOp && filterOp.movesArr && uciHist.length < filterOp.movesArr.length) {
      var opMatch = true;
      for (var k = 0; k < uciHist.length; k++) {
        if (filterOp.movesArr[k] !== uciHist[k]) { opMatch = false; break; }
      }
      if (opMatch) {
        var nextOpUci = filterOp.movesArr[uciHist.length];
        if (allLegalMoves(st).indexOf(nextOpUci) !== -1) {
          return { uci: nextOpUci, loss: 0, blundered: false };
        }
      }
    }

    var bk = lookupBookPosition(st);

    // 3. Novice: frequent tactical blunders (~55% after ply 2)
    if (rivalLevel === 'novice' && uciHist.length >= 2 && Math.random() < 0.55) {
      if (bk && bk.moves.length >= 3) {
        var bkBad = bk.moves.filter(function (m) { return m.loss >= 80 && m.loss <= 500; });
        if (bkBad.length) {
          var pickBkBad = bkBad[Math.floor(Math.random() * bkBad.length)];
          return { uci: pickBkBad.uci, loss: pickBkBad.loss, blundered: true };
        }
      }
      var rankedN = analyzePosition(st, 2);
      if (rankedN.length >= 4) {
        var bestCp = rankedN[0].turnScoreCp;
        var badPool = rankedN.filter(function (c) {
          return bestCp - c.turnScoreCp >= 95 && bestCp - c.turnScoreCp <= 600;
        });
        var pickBad = badPool.length
          ? badPool[Math.floor(Math.random() * badPool.length)]
          : rankedN[Math.min(rankedN.length - 1, 3 + Math.floor(Math.random() * 4))];
        var diffN = Math.max(0, bestCp - pickBad.turnScoreCp);
        return { uci: pickBad.uci, loss: diffN, blundered: diffN >= 90 };
      }
    }

    // 4. Club player: mixes solid lines with occasional inaccuracies/slips
    if (rivalLevel === 'club' && uciHist.length >= 2 && Math.random() < 0.25) {
      if (bk && bk.moves.length >= 2) {
        var bkSlip = bk.moves.filter(function (m) { return m.loss >= 25 && m.loss <= 150; });
        if (bkSlip.length) {
          var pickBkSlip = bkSlip[Math.floor(Math.random() * bkSlip.length)];
          return { uci: pickBkSlip.uci, loss: pickBkSlip.loss, blundered: pickBkSlip.loss >= 80 };
        }
      }
      var rankedC = analyzePosition(st, 2);
      if (rankedC.length >= 3) {
        var bestCpC = rankedC[0].turnScoreCp;
        var slipPool = rankedC.filter(function (c) {
          return bestCpC - c.turnScoreCp >= 50 && bestCpC - c.turnScoreCp <= 160;
        });
        if (slipPool.length) {
          var pickC = slipPool[Math.floor(Math.random() * slipPool.length)];
          var diffC = Math.max(0, bestCpC - pickC.turnScoreCp);
          return { uci: pickC.uci, loss: diffC, blundered: diffC >= 90 };
        }
      }
    }

    // 5. Book move selection (Master / default solid reply)
    if (bk && bk.moves.length) {
      var maxLoss = rivalLevel === 'master'
        ? (uciHist.length <= 1 && !filterOp ? 42 : 16)
        : (rivalLevel === 'club' ? 40 : 65);
      var sound = bk.moves.filter(function (m) { return m.loss <= maxLoss; });
      if (!sound.length) sound = [bk.moves[0]];
      var chosen = weightedBookChoice(sound, rivalLevel === 'master');
      return { uci: chosen.uci, loss: chosen.loss, blundered: chosen.loss >= 80 };
    }

    // 6. Out of book: Alpha-Beta search
    var ranked = analyzePosition(st, 3);
    if (!ranked.length) return null;
    if (rivalLevel === 'club' && ranked.length > 1 && Math.random() < 0.22) {
      var top2 = ranked[1];
      var diff2 = Math.max(0, ranked[0].turnScoreCp - top2.turnScoreCp);
      return { uci: top2.uci, loss: diff2, blundered: diff2 >= 90 };
    }
    return { uci: ranked[0].uci, loss: 0, blundered: false };
  }

  function applyRivalReplyNow() {
    clearRivalTimer();
    var g = state.game;
    if (!g || g.stopped || state.mode !== 'play') return;
    g.rivalThinking = false;
    var curSt = g.states[g.states.length - 1];
    if (curSt.turn === g.userColor) return;

    var legal = allLegalMoves(curSt);
    if (!legal.length) {
      g.stopped = {
        kind: 'mate',
        matedSide: curSt.turn,
        stopPly: g.moves.length
      };
      renderPlayRail();
      renderStage();
      return;
    }

    var uciHist = g.moves.map(function (m) { return m.uci; });
    var pick = pickRivalMove(curSt, uciHist, state.play.rival, state.play.openingFilter, g.revisitPath);
    if (!pick) return;

    var sanEs = moveToSan(curSt, pick.uci, 'es');
    var sanEn = moveToSan(curSt, pick.uci, 'en');
    var color = curSt.turn;
    var moveNum = Math.floor(g.moves.length / 2) + 1;
    var ns = applyUciMove(curSt, pick.uci);
    g.moves.push({ uci: pick.uci, sanEs: sanEs, sanEn: sanEn, color: color, number: moveNum, by: 'rival', loss: pick.loss || 0 });
    g.states.push(ns);
    g.cursor = g.states.length - 1;
    g.pvPreview = null;
    g.historyInspect = false;
    g.rivalJustBlundered = !!pick.blundered;

    if (allLegalMoves(ns).length === 0) {
      g.stopped = {
        kind: 'mate',
        matedSide: ns.turn,
        stopPly: g.moves.length
      };
    }

    renderPlayRail();
    renderStage();
  }

  function startPlayGame(fromMistake) {
    clearRivalTimer();
    var userColor;
    if (fromMistake && (fromMistake.userColor === 'w' || fromMistake.userColor === 'b')) {
      userColor = fromMistake.userColor;
    } else if (state.play.color === 'white') {
      userColor = 'w';
    } else if (state.play.color === 'black') {
      userColor = 'b';
    } else {
      userColor = Math.random() < 0.5 ? 'w' : 'b';
    }

    state.flipped = (userColor === 'b');
    state.selSq = null;

    var filterOp = getSelectedOpeningEntry(state.play.openingFilter);
    var revisitPath = null;
    if (!fromMistake && state.play.mistakes.length) {
      var matchingMistakes = state.play.mistakes.filter(function (m) {
        if (m.userColor !== userColor || !Array.isArray(m.moves) || !m.moves.length) return false;
        if (!filterOp || !filterOp.movesArr.length) return true;
        return m.moves.join(' ').indexOf(filterOp.movesArr.join(' ')) === 0;
      });
      if (matchingMistakes.length && Math.random() < 0.5) {
        revisitPath = matchingMistakes[Math.floor(Math.random() * matchingMistakes.length)].moves.slice();
      }
    }

    var g = {
      subMode: fromMistake ? 'fix' : 'play',
      userColor: userColor,
      moves: [],
      states: [createInitialState()],
      cursor: 0,
      stopped: null,
      pvPreview: null,
      historyInspect: false,
      undoSnap: null,
      notice: null,
      revisitPath: revisitPath,
      activeMistakeId: fromMistake ? fromMistake.id : null,
      activeMistakeObj: fromMistake || null,
      fixedMistake: null,
      mistakeTargetPly: fromMistake ? fromMistake.moves.length : null,
      rivalThinking: false,
      rivalJustBlundered: false
    };
    state.game = g;

    if (fromMistake && Array.isArray(fromMistake.moves)) {
      var st = g.states[0];
      for (var i = 0; i < fromMistake.moves.length; i++) {
        var u = fromMistake.moves[i];
        try {
          var sanEs = moveToSan(st, u, 'es');
          var sanEn = moveToSan(st, u, 'en');
          var clr = st.turn;
          var by = clr === userColor ? 'user' : 'rival';
          st = applyUciMove(st, u);
          g.moves.push({ uci: u, sanEs: sanEs, sanEn: sanEn, color: clr, number: Math.floor(i / 2) + 1, by: by, loss: 0 });
          g.states.push(st);
        } catch (_) { break; }
      }
      g.cursor = g.states.length - 1;
    } else if (userColor === 'b') {
      // Rival opens for White immediately using SampleSize1 book/filter/revisit logic
      var s0 = g.states[0];
      var pick0 = pickRivalMove(s0, [], state.play.rival, state.play.openingFilter, g.revisitPath);
      var firstUci = pick0 ? pick0.uci : 'e2e4';
      g.moves.push({
        uci: firstUci,
        sanEs: moveToSan(s0, firstUci, 'es'),
        sanEn: moveToSan(s0, firstUci, 'en'),
        color: 'w',
        number: 1,
        by: 'rival',
        loss: pick0 ? (pick0.loss || 0) : 0
      });
      g.states.push(applyUciMove(s0, firstUci));
      g.cursor = 1;
    }

    updateStatsUI();
    renderPlayRail();
    renderStage();
  }

  function submitPlayMove(uci, opts) {
    var g = state.game;
    if (!g || g.stopped || g.rivalThinking || state.mode !== 'play') return false;
    var curSt = g.states[g.states.length - 1];
    if (curSt.turn !== g.userColor) return false;
    var targets = getLegalTargets(curSt, uci.slice(0, 2));
    if (targets.indexOf(uci.slice(2, 4)) === -1) return false;

    // Save snapshot prior to user's move for Retry [T]
    g.undoSnap = {
      moves: g.moves.slice(),
      states: g.states.slice(),
      subMode: g.subMode,
      activeMistakeId: g.activeMistakeId,
      activeMistakeObj: g.activeMistakeObj,
      mistakeTargetPly: g.mistakeTargetPly,
      rivalJustBlundered: g.rivalJustBlundered
    };
    g.notice = null;

    var uciHistBefore = g.moves.map(function (m) { return m.uci; });
    var bookBefore = lookupBookPosition(curSt);
    var ranked = analyzePosition(curSt, 3, uci);
    var abBest = ranked[0];
    var abPlayed = ranked.find(function (x) { return x.uci === uci; }) || { uci: uci, turnScoreCp: 0 };

    var yourSanEs = moveToSan(curSt, uci, 'es');
    var yourSanEn = moveToSan(curSt, uci, 'en');
    var nextSt = applyUciMove(curSt, uci);
    var moveColor = curSt.turn;
    var fullMoveNum = Math.floor(uciHistBefore.length / 2) + 1;

    var bestUci, bestPlayerCp, playedPlayerCp, lossCp;

    if (bookBefore && bookBefore.moves.length) {
      var bkBest = bookBefore.moves[0];
      var abBookBest = ranked.find(function (x) { return x.uci === bkBest.uci; }) || abBest;
      var tacticalOverride = abBest && abBookBest && abBest.uci !== bkBest.uci &&
        (abBest.turnScoreCp - abBookBest.turnScoreCp >= 90 || g.rivalJustBlundered && abBest.turnScoreCp - abBookBest.turnScoreCp >= 50);

      if (tacticalOverride) {
        bestUci = abBest.uci;
        bestPlayerCp = bookBefore.cp + Math.min(450, abBest.turnScoreCp - abBookBest.turnScoreCp);
        lossCp = Math.max(0, abBest.turnScoreCp - abPlayed.turnScoreCp);
        playedPlayerCp = bestPlayerCp - lossCp;
      } else {
        bestUci = bkBest.uci;
        bestPlayerCp = bookBefore.cp - bkBest.loss;
        var bkPlayed = bookBefore.moves.find(function (m) { return m.uci === uci; });
        var bkAfter = !bkPlayed ? lookupBookPosition(nextSt) : null;
        if (bkPlayed) {
          lossCp = Math.max(0, bkPlayed.loss - bkBest.loss);
          playedPlayerCp = bestPlayerCp - lossCp;
        } else if (bkAfter) {
          playedPlayerCp = -bkAfter.cp;
          lossCp = Math.max(0, bestPlayerCp - playedPlayerCp);
        } else {
          lossCp = abBookBest ? Math.max(0, abBookBest.turnScoreCp - abPlayed.turnScoreCp) : 0;
          playedPlayerCp = bestPlayerCp - lossCp;
        }
      }
    } else {
      bestUci = abBest ? abBest.uci : uci;
      bestPlayerCp = abBest ? abBest.turnScoreCp : 0;
      playedPlayerCp = abPlayed.turnScoreCp;
      lossCp = Math.max(0, bestPlayerCp - playedPlayerCp);
    }

    var thresh = STOP_THRESHOLDS[state.play.stopOn] || 100;
    var stopGrade = lossCp >= 200 ? 'blunder' : lossCp >= 100 ? 'mistake' : 'inaccuracy';

    g.moves.push({ uci: uci, sanEs: yourSanEs, sanEn: yourSanEn, color: moveColor, number: fullMoveNum, by: 'user', loss: lossCp });
    g.states.push(nextSt);
    g.cursor = g.states.length - 1;
    g.pvPreview = null;
    g.historyInspect = false;
    state.selSq = null;

    var oppHasMoves = allLegalMoves(nextSt).length > 0;
    var userDeliveredMate = !oppHasMoves && inCheck(nextSt, nextSt.turn);

    if (!userDeliveredMate && lossCp >= thresh && bestUci && bestUci !== uci) {
      var kind = g.rivalJustBlundered ? 'missed' : 'error';
      var bestSanEs = moveToSan(curSt, bestUci, 'es');
      var bestSanEn = moveToSan(curSt, bestUci, 'en');
      var playedLine = buildContinuationLine(curSt, uci, 7, fullMoveNum);
      var bestLine = buildContinuationLine(curSt, bestUci, 7, fullMoveNum);
      var detStop = detectOpening(uciHistBefore);

      g.stopped = {
        kind: kind,
        grade: stopGrade,
        moveNumber: fullMoveNum,
        preState: curSt,
        opening: detStop.isNamed ? detStop : null,
        stopPly: g.moves.length,
        yourUci: uci,
        yourSanEs: yourSanEs,
        yourSanEn: yourSanEn,
        playedPlayerCp: playedPlayerCp,
        yourPv: playedLine,
        bestUci: bestUci,
        bestSanEs: bestSanEs,
        bestSanEn: bestSanEn,
        bestPlayerCp: bestPlayerCp,
        bestPv: bestLine,
        lossCp: lossCp
      };

      if (g.subMode !== 'fix') {
        state.play.streak = 0;
        state.play.totalGames += 1;
        savePlayStats();
      }

      // Queue this pre-blunder position in mistakes list (newest first, max 40)
      var key = uciHistBefore.join(',');
      state.play.mistakes = state.play.mistakes.filter(function (m) {
        return !(m.moves.join(',') === key && m.userColor === g.userColor);
      });
      state.play.mistakes.unshift({
        id: 'm_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        moves: uciHistBefore,
        userColor: g.userColor,
        playedUci: uci,
        playedSanEs: yourSanEs,
        playedSanEn: yourSanEn,
        bestUci: bestUci,
        eco: detStop.eco,
        es: detStop.es,
        en: detStop.en
      });
      if (state.play.mistakes.length > 40) state.play.mistakes.length = 40;
      STORE.set('mistakes', state.play.mistakes);

      flashStage(false);
      updateStatsUI();
      renderPlayRail();
      renderStage();
      return true;
    }

    // Passed! Check if we cleared a queued mistake position (in fix mode or in a live game)
    var curKey = uciHistBefore.join(',');
    var clearedMistake = state.play.mistakes.find(function (m) {
      return (g.activeMistakeId && m.id === g.activeMistakeId) || (m.moves.join(',') === curKey && m.userColor === g.userColor);
    });
    if (clearedMistake) {
      state.play.mistakes = state.play.mistakes.filter(function (m) { return m !== clearedMistake; });
      STORE.set('mistakes', state.play.mistakes);
      if (g.subMode === 'fix') {
        g.fixedMistake = {
          oldSanEs: clearedMistake.playedSanEs || '—',
          oldSanEn: clearedMistake.playedSanEn || '—',
          nowSanEs: yourSanEs,
          nowSanEn: yourSanEn
        };
        g.activeMistakeId = null;
        flashStage(true);
        updateStatsUI();
        renderPlayRail();
        renderStage();
        return true;
      }
      g.activeMistakeId = null;
    }

    var userMoveCount = g.moves.filter(function (m) { return m.by === 'user'; }).length;
    if (userDeliveredMate || userMoveCount >= state.play.duration || !oppHasMoves) {
      g.stopped = {
        kind: userDeliveredMate ? 'mate' : 'clean',
        matedSide: nextSt.turn,
        movesPlayed: userMoveCount,
        stopPly: g.moves.length
      };
      if (g.subMode !== 'fix') {
        state.play.cleanGames += 1;
        state.play.totalGames += 1;
        state.play.streak += 1;
        if (state.play.streak > state.play.best) state.play.best = state.play.streak;
        savePlayStats();
      }
      flashStage(true);
      updateStatsUI();
      renderPlayRail();
      renderStage();
      return true;
    }

    updateStatsUI();
    renderPlayRail();
    if (opts && opts.sync) {
      applyRivalReplyNow();
    } else {
      g.rivalThinking = true;
      renderStage();
      clearRivalTimer();
      rivalTimer = setTimeout(applyRivalReplyNow, 180);
    }
    return true;
  }

  function undoAndRetryPlay() {
    var g = state.game;
    if (!g || !g.undoSnap || state.mode !== 'play') return false;
    clearRivalTimer();
    g.moves = g.undoSnap.moves.slice();
    g.states = g.undoSnap.states.slice();
    g.subMode = g.undoSnap.subMode;
    g.activeMistakeId = g.undoSnap.activeMistakeId;
    g.activeMistakeObj = g.undoSnap.activeMistakeObj;
    g.mistakeTargetPly = g.undoSnap.mistakeTargetPly;
    g.rivalJustBlundered = g.undoSnap.rivalJustBlundered;
    g.cursor = g.states.length - 1;
    g.stopped = null;
    g.pvPreview = null;
    g.historyInspect = false;
    g.fixedMistake = null;
    g.undoSnap = null;
    g.rivalThinking = false;
    g.notice = S().playUI.noticeSamePos;
    state.selSq = null;
    renderPlayRail();
    renderStage();
    return true;
  }

  function stepPlayLine(delta) {
    var g = state.game;
    if (!g || state.mode !== 'play') return;
    state.selSq = null;
    if (g.stopped && (g.stopped.kind === 'error' || g.stopped.kind === 'missed')) {
      if (!g.pvPreview) {
        if (delta > 0 && g.stopped.bestPv.moves.length) {
          g.pvPreview = {
            which: 'best',
            states: g.stopped.bestPv.states,
            moves: g.stopped.bestPv.moves,
            step: 1
          };
          renderStage();
        }
        return;
      }
      var nextIdx = g.pvPreview.step + delta;
      if (nextIdx <= 0) {
        g.pvPreview = null;
      } else if (nextIdx <= Math.min(7, g.pvPreview.moves.length)) {
        g.pvPreview.step = nextIdx;
      }
      renderStage();
      return;
    }
    var nextCur = Math.max(0, Math.min(g.states.length - 1, g.cursor + delta));
    g.cursor = nextCur;
    renderPlayRail();
    renderStage();
  }

  function startFixAt(idx) {
    if (!state.play.mistakes.length) {
      startPlayGame(null);
      return;
    }
    var safeIdx = ((idx || 0) % state.play.mistakes.length + state.play.mistakes.length) % state.play.mistakes.length;
    startPlayGame(state.play.mistakes[safeIdx]);
  }

  /* =====================================================================
   * RENDER STAGE, PROMPT & DOCK
   * ===================================================================== */
  function renderDockActions() {
    var s = S();
    var box = $('actions');
    box.innerHTML = '';

    if (state.mode === 'play') {
      var g = state.game;
      if (!g) return;
      var pui = s.playUI;

      if (g.subMode === 'fix') {
        if (g.stopped && (g.stopped.kind === 'error' || g.stopped.kind === 'missed')) {
          var retryF = document.createElement('button');
          retryF.type = 'button';
          retryF.className = 'act';
          retryF.id = 'playRetryBtn';
          retryF.innerHTML = pui.tryAgain + ' <kbd>T</kbd>';
          retryF.addEventListener('click', undoAndRetryPlay);
          box.appendChild(retryF);

          var nextF = document.createElement('button');
          nextF.type = 'button';
          nextF.className = 'act primary';
          nextF.id = 'playNewDockBtn';
          nextF.innerHTML = (state.play.mistakes.length > 1 ? pui.nextMistake : pui.backToPlay) + ' <kbd>↵</kbd>';
          nextF.addEventListener('click', function () {
            if (state.play.mistakes.length > 1) startFixAt(1);
            else startPlayGame(null);
          });
          box.appendChild(nextF);
        } else if (g.fixedMistake) {
          var contF = document.createElement('button');
          contF.type = 'button';
          contF.className = 'act primary';
          contF.id = 'playNewDockBtn';
          contF.innerHTML = (state.play.mistakes.length ? pui.nextMistake : pui.backToPlay) + ' <kbd>↵</kbd>';
          contF.addEventListener('click', function () {
            if (state.play.mistakes.length) startFixAt(0);
            else startPlayGame(null);
          });
          box.appendChild(contF);
        } else {
          var backP = document.createElement('button');
          backP.type = 'button';
          backP.className = 'act';
          backP.id = 'playNewDockBtn';
          backP.textContent = pui.backToPlay;
          backP.addEventListener('click', function () { startPlayGame(null); });
          box.appendChild(backP);
        }
        return;
      }

      if (g.stopped && (g.stopped.kind === 'error' || g.stopped.kind === 'missed')) {
        var retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'act';
        retry.id = 'playRetryBtn';
        retry.innerHTML = pui.tryAgain + ' <kbd>T</kbd>';
        retry.addEventListener('click', undoAndRetryPlay);
        box.appendChild(retry);

        var ngStop = document.createElement('button');
        ngStop.type = 'button';
        ngStop.className = 'act primary';
        ngStop.id = 'playNewDockBtn';
        ngStop.innerHTML = pui.newGame + ' <kbd>↵</kbd>';
        ngStop.addEventListener('click', function () { startPlayGame(null); });
        box.appendChild(ngStop);
        return;
      }

      if (g.stopped) {
        var ngDone = document.createElement('button');
        ngDone.type = 'button';
        ngDone.className = 'act primary';
        ngDone.id = 'playNewDockBtn';
        ngDone.innerHTML = pui.newGame + ' <kbd>↵</kbd>';
        ngDone.addEventListener('click', function () { startPlayGame(null); });
        box.appendChild(ngDone);
        return;
      }

      var ngLive = document.createElement('button');
      ngLive.type = 'button';
      ngLive.className = 'act';
      ngLive.id = 'playNewDockBtn';
      ngLive.textContent = pui.newGame;
      ngLive.addEventListener('click', function () { startPlayGame(null); });
      box.appendChild(ngLive);
      return;
    }

    if (state.mode === 'study') {
      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'act';
      prev.innerHTML = '<kbd>←</kbd> ' + s.actions.prev;
      prev.addEventListener('click', function () { stepMove(-1); });

      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'act';
      next.innerHTML = s.actions.next + ' <kbd>→</kbd>';
      next.addEventListener('click', function () { stepMove(1); });

      var go = document.createElement('button');
      go.type = 'button';
      go.className = 'act primary';
      go.textContent = s.actions.goPractice;
      go.addEventListener('click', function () {
        state.mode = 'practice';
        STORE.set('mode', 'practice');
        applyStaticLabels();
        startRoundOrQuestion(true);
      });

      box.appendChild(prev);
      box.appendChild(next);
      box.appendChild(go);
      return;
    }

    var q = state.question;
    if (!q || (state.mode === 'test' && state.roundAsk > state.roundTarget)) return;

    q.options.forEach(function (opt, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'act';
      if (state.answered) {
        btn.disabled = true;
        if (opt.isRight) btn.classList.add('is-right');
        else if (idx === q.pickedIdx) btn.classList.add('is-wrong');
      }
      btn.innerHTML = '<kbd>' + (idx + 1) + '</kbd> ' + opt.label;
      btn.addEventListener('click', function () {
        if (!state.answered) submitChoiceAnswer(idx);
      });
      box.appendChild(btn);
    });

    if (state.answered) {
      var isLast = state.mode === 'test' && state.roundAsk >= state.roundTarget;
      var nb = document.createElement('button');
      nb.type = 'button';
      nb.className = 'act primary';
      nb.id = 'nextBtn';
      nb.innerHTML = (isLast ? s.actions.viewSummary : s.actions.nextQ) + ' <kbd>Space</kbd>';
      nb.addEventListener('click', advanceQuestion);
      box.appendChild(nb);
    }
  }

  function renderTopPrompt() {
    var s = S();
    var pr = $('prompt');
    var tipBox = $('pTip');
    var linesBox = $('pLines');
    pr.classList.remove('is-ok', 'is-bad');

    if (state.mode !== 'play') {
      if (tipBox) { tipBox.innerHTML = ''; tipBox.hidden = true; }
      if (linesBox) { linesBox.innerHTML = ''; linesBox.hidden = true; }
    }

    if (state.mode === 'play') {
      var pui = s.playUI;
      var g = state.game;
      var suf = LANG === 'en' ? 'En' : 'Es';
      $('pBarWrap').classList.add('is-off');
      if (!g) {
        $('pEyebrow').textContent = pui.eyebrowTurn.replace('{m}', '1').replace('{t}', String(state.play.duration));
        $('pName').textContent = pui.detectInit;
        $('pMeta').textContent = '—';
        if (tipBox) { tipBox.innerHTML = ''; tipBox.hidden = true; }
        if (linesBox) { linesBox.innerHTML = ''; linesBox.hidden = true; }
        renderDockActions();
        return;
      }

      var uciHist = g.moves.map(function (m) { return m.uci; });
      var det = detectOpening(uciHist);
      var opTitle = det.isNamed ? (LANG === 'en' ? det.en : det.es) : null;
      var sideStr = g.userColor === 'w' ? pui.whiteSide : pui.blackSide;
      var rivalStr = pui.rivals[state.play.rival] || state.play.rival;
      var userMoveNo = Math.min(state.play.duration, g.moves.filter(function (m) { return m.by === 'user'; }).length + (g.stopped ? 0 : 1));

      var eyebrow = '';
      var pname = '';
      var pmeta = '';
      var tips = [];

      if (g.stopped && (g.stopped.kind === 'error' || g.stopped.kind === 'missed')) {
        var stp = g.stopped;
        var kindLbl = stp.kind === 'missed' ? pui.missedChance : (pui.grades[stp.grade] || pui.grades.mistake);
        var yourSan = stp['yourSan' + suf];
        var bestSan = stp['bestSan' + suf];
        pr.classList.add('is-bad');
        eyebrow = pui.eyebrowStop.replace('{kind}', kindLbl).replace('{m}', String(stp.moveNumber));
        pname = pui.stopTitle.replace('{move}', yourSan).replace('{desc}', describeEval(stp.playedPlayerCp, LANG));
        pmeta = stp.opening ? (LANG === 'en' ? stp.opening.en : stp.opening.es) : pui.beforeOpening;
        tips.push(
          pui.evalCompare
            .replace('{best}', bestSan)
            .replace('{bestDesc}', describeEval(stp.bestPlayerCp, LANG))
            .replace('{bestEval}', formatPlayerEval(stp.bestPlayerCp))
            .replace('{played}', yourSan)
            .replace('{playedDesc}', describeEval(stp.playedPlayerCp, LANG))
            .replace('{playedEval}', formatPlayerEval(stp.playedPlayerCp))
        );
        if (stp.yourPv && stp.yourPv.moves.length >= 2) {
          tips.push(
            pui.engineReply
              .replace('{played}', yourSan)
              .replace('{reply}', formatChipLabel(stp.yourPv.moves[1], true, suf))
          );
        }
        tips.push(explainMoveReason(stp.preState, stp.bestUci, bestSan, LANG));
      } else if (g.subMode === 'fix' && g.fixedMistake) {
        pr.classList.add('is-ok');
        eyebrow = pui.eyebrowFixed;
        pname = pui.fixedTitle.replace('{now}', g.fixedMistake['nowSan' + suf]);
        var oldSan = g.fixedMistake['oldSan' + suf];
        pmeta = state.play.mistakes.length
          ? pui.fixedMeta.replace('{old}', oldSan).replace('{n}', String(state.play.mistakes.length))
          : pui.fixedNoneLeft.replace('{old}', oldSan);
      } else if (g.stopped && g.stopped.kind === 'mate') {
        var wonMate = g.stopped.matedSide !== g.userColor;
        pr.classList.add(wonMate ? 'is-ok' : 'is-bad');
        eyebrow = wonMate ? pui.checkmate : pui.checkmated;
        pname = wonMate ? pui.mateFinish : pui.youWereMated;
        pmeta = [opTitle, sideStr + ' · ' + rivalStr].filter(Boolean).join(' · ');
      } else if (g.stopped && g.stopped.kind === 'clean') {
        pr.classList.add('is-ok');
        eyebrow = pui.eyebrowClean.replace('{m}', String(g.stopped.movesPlayed || state.play.duration));
        pname = pui.cleanMsg.replace('{t}', String(state.play.duration)).replace('{s}', String(state.play.streak));
        pmeta = [opTitle, sideStr + ' · ' + rivalStr].filter(Boolean).join(' · ');
      } else if (g.subMode === 'fix' && g.activeMistakeObj) {
        eyebrow = pui.eyebrowFix.replace('{i}', '1').replace('{n}', String(Math.max(1, state.play.mistakes.length)));
        pname = pui.findBetter.replace('{move}', g.activeMistakeObj['playedSan' + suf] || g.activeMistakeObj.playedSanEs || '?');
        pmeta = [opTitle || pui.beforeOpening, sideStr].join(' · ');
        if (g.notice) tips.push(g.notice);
      } else {
        eyebrow = pui.eyebrowTurn.replace('{m}', String(userMoveNo)).replace('{t}', String(state.play.duration));
        pname = opTitle || pui.detectInit;
        pmeta = (det.isNamed ? (det.eco + ' · ') : '') + pui.metaSub
          .replace('{eco}', det.eco || '—')
          .replace('{side}', sideStr)
          .replace('{rival}', rivalStr)
          .replace(/^—\s*·\s*/, '');
        if (g.notice) tips.push(g.notice);
      }

      $('pEyebrow').textContent = eyebrow;
      $('pName').textContent = pname;
      $('pMeta').textContent = pmeta;

      if (tipBox) {
        tipBox.innerHTML = '';
        tipBox.hidden = tips.length === 0;
        tips.forEach(function (txt) {
          var pEl = document.createElement('p');
          pEl.textContent = txt;
          tipBox.appendChild(pEl);
        });
      }

      if (linesBox) {
        linesBox.innerHTML = '';
        var showStopLines = !!(g.stopped && (g.stopped.kind === 'error' || g.stopped.kind === 'missed'));
        linesBox.hidden = !showStopLines;
        if (showStopLines) {
          var stpL = g.stopped;
          [
            { key: 'played', cls: 'bad', label: pui.youPlayedRow, pv: stpL.yourPv, cp: stpL.playedPlayerCp },
            { key: 'best', cls: 'good', label: pui.betterRow, pv: stpL.bestPv, cp: stpL.bestPlayerCp }
          ].forEach(function (spec) {
            var row = document.createElement('div');
            row.className = 'lrow ' + spec.cls;
            var labEl = document.createElement('span');
            labEl.className = 'lab';
            labEl.textContent = spec.label;
            row.appendChild(labEl);

            (spec.pv ? spec.pv.moves.slice(0, 7) : []).forEach(function (mv, idx) {
              var pressed = !!(g.pvPreview && g.pvPreview.which === spec.key && g.pvPreview.step === idx + 1);
              var chip = document.createElement('button');
              chip.type = 'button';
              chip.className = 'chipmove';
              chip.setAttribute('aria-pressed', String(pressed));
              chip.textContent = formatChipLabel(mv, idx === 0, suf);
              chip.addEventListener('click', function () {
                if (pressed) {
                  g.pvPreview = null;
                } else {
                  g.pvPreview = {
                    which: spec.key,
                    states: spec.pv.states,
                    moves: spec.pv.moves,
                    step: idx + 1
                  };
                }
                renderStage();
              });
              row.appendChild(chip);
            });

            var valEl = document.createElement('span');
            valEl.className = 'lab';
            valEl.textContent = formatPlayerEval(spec.cp);
            row.appendChild(valEl);
            linesBox.appendChild(row);
          });
        }
      }

      renderDockActions();
      return;
    }

    if (state.mode === 'study') {
      var o = BY_ID[state.openingId] || OPENINGS[0];
      $('pEyebrow').textContent = s.studyEyebrow + ' · ECO ' + o.eco + ' · ' + state.ply + '/' + o.moves.length;
      $('pName').textContent = opName(o);
      var suf = LANG === 'en' ? 'En' : 'Es';
      $('pMeta').textContent = state.showTrap
        ? (o.trap['blunderSan' + suf] + ' → ' + o.trap['refuteSan' + suf])
        : (state.ply > 0 ? o.moves[state.ply - 1]['san' + suf] : s.ctrlStart);
      $('pBarWrap').classList.add('is-off');
      renderDockActions();
      return;
    }

    var q = state.question;
    if (!q) return;
    if (state.mode === 'test') {
      $('pBarWrap').classList.remove('is-off');
      $('pBar').style.width = Math.min(100, Math.round((state.roundAsk / state.roundTarget) * 100)) + '%';
    } else {
      $('pBarWrap').classList.add('is-off');
    }

    if (state.answered) {
      pr.classList.add(state.lastOk ? 'is-ok' : 'is-bad');
      $('pEyebrow').textContent = (state.lastOk ? s.rightMsg.trim() : s.wrongMsg + opName(q.opening)) + ' · ECO ' + q.opening.eco;
      $('pName').textContent = opName(q.opening) + (q.kind === 'board' ? ' — ' + q.rightMoveSan : '');
      $('pMeta').textContent = LANG === 'en' ? q.opening.ideaEn : q.opening.ideaEs;
    } else {
      $('pEyebrow').textContent = q.eyebrow;
      $('pName').textContent = q.title;
      $('pMeta').textContent = q.meta;
    }
    renderDockActions();
  }

  function renderStage() {
    var s = S();
    var felt = $('felt');
    felt.innerHTML = '';
    var pool = activePool();

    if (state.mode === 'play') {
      if (!state.game) { startPlayGame(null); return; }
      var g = state.game;
      var playLayout = document.createElement('div');
      playLayout.className = 'chess-layout play-layout' + (g.stopped ? ' has-stop' : '');

      var displaySt;
      var playArrows = [];
      var playBad = [];
      var playOk = [];
      var barPlayerCp = null;
      var stp = g.stopped;
      var isStopErr = !!(stp && (stp.kind === 'error' || stp.kind === 'missed'));

      if (g.pvPreview) {
        displaySt = g.pvPreview.states[g.pvPreview.step] || g.states[g.cursor];
        var pmv = g.pvPreview.moves[g.pvPreview.step - 1];
        if (pmv) {
          playArrows.push({
            from: pmv.uci.slice(0, 2),
            to: pmv.uci.slice(2, 4),
            color: g.pvPreview.which === 'best' ? '#5fd39a' : '#ff7a6b'
          });
        }
        if (isStopErr) {
          barPlayerCp = g.pvPreview.which === 'best' ? stp.bestPlayerCp : stp.playedPlayerCp;
        }
      } else if (isStopErr && !g.historyInspect) {
        // Show pre-blunder board with red arrow (your move) & green arrow (best move) like Screenshot 1
        displaySt = stp.preState;
        playArrows.push({ from: stp.yourUci.slice(0, 2), to: stp.yourUci.slice(2, 4), color: '#ff7a6b' });
        playArrows.push({ from: stp.bestUci.slice(0, 2), to: stp.bestUci.slice(2, 4), color: '#5fd39a' });
        barPlayerCp = stp.bestPlayerCp;
      } else {
        displaySt = g.states[g.cursor] || g.states[g.states.length - 1];
        if (isStopErr) barPlayerCp = stp.bestPlayerCp;
      }

      var atLiveBoard = !g.stopped && !g.fixedMistake && !g.pvPreview && g.cursor === g.states.length - 1 && !g.rivalThinking && displaySt.turn === g.userColor;
      var playLegal = atLiveBoard && state.selSq ? getLegalTargets(displaySt, state.selSq) : [];

      var pBoardPane = document.createElement('div');
      pBoardPane.className = 'board-pane';

      var boardRow = document.createElement('div');
      boardRow.className = 'board-row';

      var evalBar = document.createElement('div');
      evalBar.id = 'evalBar';
      evalBar.className = 'eval-bar' + (barPlayerCp != null ? ' is-on' : '') + (state.flipped ? ' flip' : '');
      evalBar.setAttribute('aria-hidden', 'true');
      var evalFill = document.createElement('div');
      evalFill.id = 'evalFill';
      evalFill.className = 'eval-fill';
      if (barPlayerCp != null) {
        var whiteCpBar = g.userColor === 'w' ? barPlayerCp : -barPlayerCp;
        evalFill.style.height = winChance(whiteCpBar).toFixed(1) + '%';
      }
      evalBar.appendChild(evalFill);
      boardRow.appendChild(evalBar);

      boardRow.appendChild(buildBoardDOM(displaySt, {
        flipped: state.flipped,
        selSq: atLiveBoard ? state.selSq : null,
        legalDests: playLegal,
        okSquares: playOk,
        badSquares: playBad,
        arrows: playArrows,
        onPieceDrop: atLiveBoard ? function (fromSq, toSq) {
          state.selSq = null;
          submitPlayMove(fromSq + toSq);
        } : null,
        onSquareClick: function (sq) {
          if (!atLiveBoard) return;
          var rc = sqToRC(sq), p = displaySt.board[rc[0]][rc[1]];
          if (!state.selSq) {
            if (p && p[0] === g.userColor) { state.selSq = sq; renderStage(); }
            return;
          }
          if (sq === state.selSq) { state.selSq = null; renderStage(); return; }
          var targets = getLegalTargets(displaySt, state.selSq);
          if (targets.indexOf(sq) !== -1) {
            var uci = state.selSq + sq;
            state.selSq = null;
            submitPlayMove(uci);
            return;
          }
          if (p && p[0] === g.userColor) { state.selSq = sq; renderStage(); }
          else { state.selSq = null; renderStage(); }
        }
      }));

      pBoardPane.appendChild(boardRow);
      playLayout.appendChild(pBoardPane);
      felt.appendChild(playLayout);
      renderTopPrompt();
      return;
    }

    if (state.mode === 'study') {
      if (!pool.some(function (x) { return x.id === state.openingId; })) {
        state.openingId = pool[0].id;
      }
      var o = BY_ID[state.openingId] || pool[0];
      var suf = LANG === 'en' ? 'En' : 'Es';

      // Opening selector strip
      var strip = document.createElement('div');
      strip.className = 'op-strip';
      pool.forEach(function (item) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'op-pill';
        btn.setAttribute('aria-pressed', String(item.id === o.id));
        btn.innerHTML = '<span class="eco">' + item.eco + '</span><span>' + opName(item) + '</span>';
        btn.addEventListener('click', function () {
          state.openingId = item.id;
          STORE.set('openingId', item.id);
          state.ply = 6;
          state.showTrap = false;
          state.flipped = item.side === 'b';
          state.selSq = null;
          renderStage();
        });
        strip.appendChild(btn);
      });
      felt.appendChild(strip);

      // Compute board state
      var boardSt;
      var arrows = [];
      if (state.showTrap && o.trap) {
        boardSt = boardAfterPlies(o, o.trap.ply);
        boardSt = applyUciMove(boardSt, o.trap.blunderUci);
        var blunderRef = o.trap.blunderUci;
        var refuteRef = o.trap.refuteUci;
        arrows = [
          { from: blunderRef.slice(0, 2), to: blunderRef.slice(2, 4), color: '#ff7a6b' },
          { from: refuteRef.slice(0, 2), to: refuteRef.slice(2, 4), color: '#5fd39a' }
        ];
      } else {
        boardSt = boardAfterPlies(o, state.ply);
        if (state.ply > 0) {
          var mv = o.moves[state.ply - 1];
          arrows = [{ from: mv.uci.slice(0, 2), to: mv.uci.slice(2, 4), color: '#6fd0e8' }];
        }
      }

      var layout = document.createElement('div');
      layout.className = 'chess-layout';

      var bPane = document.createElement('div');
      bPane.className = 'board-pane';
      var legalDests = state.selSq ? getLegalTargets(boardSt, state.selSq) : [];
      bPane.appendChild(buildBoardDOM(boardSt, {
        flipped: state.flipped,
        selSq: state.selSq,
        legalDests: legalDests,
        keySquares: o.keySquares,
        arrows: arrows,
        onSquareClick: function (sq) {
          var rc = sqToRC(sq), p = boardSt.board[rc[0]][rc[1]];
          if (state.selSq === sq) { state.selSq = null; renderStage(); return; }
          if (p && p[0] === boardSt.turn) { state.selSq = sq; renderStage(); }
          else { state.selSq = null; renderStage(); }
        }
      }));

      var ctrls = document.createElement('div');
      ctrls.className = 'board-controls';
      ctrls.innerHTML =
        '<button class="ctrl-btn" type="button" id="btnStart">⏮ ' + s.ctrlStart + '</button>' +
        '<button class="ctrl-btn" type="button" id="btnPrev">◀ ' + s.ctrlPrev + '</button>' +
        '<button class="ctrl-btn" type="button" id="btnNext">' + s.ctrlNext + ' ▶</button>' +
        '<button class="ctrl-btn" type="button" id="btnEnd">' + s.ctrlEnd + ' ⏭</button>' +
        '<button class="ctrl-btn" type="button" id="btnFlip">⇅ ' + s.ctrlFlip + ' <kbd>F</kbd></button>' +
        '<button class="ctrl-btn" type="button" id="btnTrap" aria-pressed="' + String(state.showTrap) + '">⚡ ' + s.ctrlTrap + '</button>';
      bPane.appendChild(ctrls);

      layout.appendChild(bPane);
      layout.appendChild(buildTheoryInspector(o, boardSt, state.ply, state.showTrap));
      felt.appendChild(layout);

      $('btnStart').onclick = function () { state.showTrap = false; state.ply = 0; renderStage(); };
      $('btnPrev').onclick = function () { stepMove(-1); };
      $('btnNext').onclick = function () { stepMove(1); };
      $('btnEnd').onclick = function () { state.showTrap = false; state.ply = o.moves.length; renderStage(); };
      $('btnFlip').onclick = function () { state.flipped = !state.flipped; renderStage(); };
      $('btnTrap').onclick = function () { state.showTrap = !state.showTrap; renderStage(); };

      renderTopPrompt();
      return;
    }

    // Quiz modes (Practice / Test)
    if (state.mode === 'test' && state.roundAsk > state.roundTarget) {
      renderRoundSummary(felt);
      return;
    }

    var q = state.question;
    if (!q) return;

    var qLayout = document.createElement('div');
    qLayout.className = 'chess-layout';

    var qbPane = document.createElement('div');
    qbPane.className = 'board-pane';
    var qBoard = boardAfterPlies(q.opening, q.ply);
    var qArrows = [];
    var okSqs = [];
    var badSqs = [];

    if (state.answered) {
      if (q.kind === 'board') {
        var rFrom = q.rightUci.slice(0, 2), rTo = q.rightUci.slice(2, 4);
        qArrows.push({ from: rFrom, to: rTo, color: '#5fd39a' });
        okSqs.push(rTo);
        if (!state.lastOk && q.pickedUci) {
          badSqs.push(q.pickedUci.slice(2, 4));
          qArrows.push({ from: q.pickedUci.slice(0, 2), to: q.pickedUci.slice(2, 4), color: '#ff7a6b' });
        }
      } else if (q.ply > 0) {
        var lastMv = q.opening.moves[q.ply - 1];
        qArrows.push({ from: lastMv.uci.slice(0, 2), to: lastMv.uci.slice(2, 4), color: '#6fd0e8' });
      }
    }

    var qLegal = state.selSq && !state.answered && q.kind === 'board' ? getLegalTargets(qBoard, state.selSq) : [];
    qbPane.appendChild(buildBoardDOM(qBoard, {
      flipped: state.flipped,
      selSq: state.selSq,
      legalDests: qLegal,
      keySquares: state.answered ? q.opening.keySquares : [],
      okSquares: okSqs,
      badSquares: badSqs,
      arrows: qArrows,
      onPieceDrop: (!state.answered && q.kind === 'board') ? function (fromSq, toSq) {
        state.selSq = null;
        submitBoardMove(fromSq + toSq);
      } : null,
      onSquareClick: function (sq) {
        if (state.answered || q.kind !== 'board') return;
        var rc = sqToRC(sq), p = qBoard.board[rc[0]][rc[1]];
        if (!state.selSq) {
          if (p && p[0] === qBoard.turn) {
            state.selSq = sq;
            renderStage();
          }
          return;
        }
        if (sq === state.selSq) { state.selSq = null; renderStage(); return; }
        var targets = getLegalTargets(qBoard, state.selSq);
        if (targets.indexOf(sq) !== -1) {
          var moveUci = state.selSq + sq;
          state.selSq = null;
          submitBoardMove(moveUci);
          return;
        }
        if (p && p[0] === qBoard.turn) {
          state.selSq = sq;
          renderStage();
        } else {
          state.selSq = null;
          renderStage();
        }
      }
    }));

    var qCtrls = document.createElement('div');
    qCtrls.className = 'board-controls';
    qCtrls.innerHTML = '<button class="ctrl-btn" type="button" id="btnFlipQ">⇅ ' + s.ctrlFlip + ' <kbd>F</kbd></button>';
    qbPane.appendChild(qCtrls);
    qLayout.appendChild(qbPane);

    if (state.answered) {
      qLayout.appendChild(buildTheoryInspector(q.opening, qBoard, q.ply, false));
    } else {
      var card = document.createElement('div');
      card.className = 'quiz-card';
      card.innerHTML = '<b>' + q.cardTitle + '</b><span>' + q.cardHint + '</span>';
      qLayout.appendChild(card);
    }

    felt.appendChild(qLayout);
    var bf = $('btnFlipQ');
    if (bf) bf.onclick = function () { state.flipped = !state.flipped; renderStage(); };

    renderTopPrompt();
  }

  function stepMove(delta) {
    var o = BY_ID[state.openingId] || OPENINGS[0];
    state.showTrap = false;
    state.selSq = null;
    state.ply = Math.max(0, Math.min(o.moves.length, state.ply + delta));
    renderStage();
  }

  function renderRoundSummary(felt) {
    var s = S();
    state.frozenSec = elapsedSec();
    var timeSec = Math.round(state.frozenSec);
    var acc = Math.round((state.roundRight / state.roundTarget) * 100);
    var passed = acc >= 90;
    var prev = state.bests[state.block];
    if (!prev || acc > prev.pct || (acc === prev.pct && timeSec < prev.time)) {
      state.bests[state.block] = { pct: acc, time: timeSec };
      STORE.set('bests', state.bests);
    }
    renderRail();
    updateStatsUI();

    var box = document.createElement('div');
    box.className = 'quiz-card';
    box.style.maxWidth = '560px';
    box.innerHTML =
      '<b style="font-size:20px">' + s.roundDone + ' · ' + acc + '%</b>' +
      '<span>' + state.roundRight + ' / ' + state.roundTarget + ' ' + s.roundMeta + fmtClock(timeSec) + '</span>';

    var again = document.createElement('button');
    again.type = 'button';
    again.className = 'btn primary';
    again.style.justifySelf = 'center';
    again.textContent = s.actions.restart;
    again.addEventListener('click', function () { startRoundOrQuestion(true); });
    box.appendChild(again);
    felt.appendChild(box);

    var pr = $('prompt');
    pr.classList.remove('is-ok', 'is-bad');
    pr.classList.add(passed ? 'is-ok' : 'is-bad');
    $('pEyebrow').textContent = s.modes.test;
    $('pName').textContent = s.roundDone + ' · ' + acc + '%';
    $('pMeta').textContent = passed ? s.passedMsg : s.retryMsg;
    $('pBar').style.width = '100%';
    $('actions').innerHTML = '';
  }

  /* =====================================================================
   * CHALLENGE GENERATOR (board / identify / plan / mix)
   * ===================================================================== */
  function makeQuestion() {
    var s = S();
    var pool = activePool();
    var opening = pool[Math.floor(Math.random() * pool.length)];
    var kinds = state.task === 'mix' ? ['board', 'identify', 'plan'] : [state.task];
    var kind = kinds[Math.floor(Math.random() * kinds.length)];
    var suf = LANG === 'en' ? 'En' : 'Es';

    if (kind === 'board') {
      // Pick a critical theoretical ply between 4 and 9
      var plyIdx = 4 + Math.floor(Math.random() * Math.min(6, opening.moves.length - 4));
      var targetMove = opening.moves[plyIdx];
      var boardBefore = boardAfterPlies(opening, plyIdx);
      state.flipped = boardBefore.turn === 'b';

      // Build 3 legal distinct distractor moves from the same position
      var allLegal = [];
      for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
          var p = boardBefore.board[r][c];
          if (!p || p[0] !== boardBefore.turn) continue;
          var sq = rcToSq(r, c);
          getLegalTargets(boardBefore, sq).forEach(function (dest) {
            var u = sq + dest;
            if (u !== targetMove.uci) {
              allLegal.push({ uci: u, san: uciToSimpleSan(boardBefore, u) });
            }
          });
        }
      }
      var cleanRight = targetMove['san' + suf].replace(/^\d+\.+/, '');
      var picks = [];
      var usedSan = Object.create(null);
      usedSan[cleanRight] = true;
      shuffle(allLegal).forEach(function (cand) {
        if (picks.length < 3 && !usedSan[cand.san]) {
          usedSan[cand.san] = true;
          picks.push({ label: cand.san, uci: cand.uci, isRight: false });
        }
      });
      var opts = shuffle([{ label: cleanRight, uci: targetMove.uci, isRight: true }].concat(picks));

      return {
        kind: 'board',
        opening: opening,
        ply: plyIdx,
        rightUci: targetMove.uci,
        rightMoveSan: targetMove['san' + suf],
        pickedUci: null,
        pickedIdx: -1,
        options: opts,
        eyebrow: s.qBoardEyebrow,
        title: boardBefore.turn === 'w' ? s.qBoardWhite : s.qBoardBlack,
        meta: s.qBoardMeta,
        cardTitle: boardBefore.turn === 'w' ? s.qBoardWhite : s.qBoardBlack,
        cardHint: s.qBoardMeta
      };
    }

    if (kind === 'identify') {
      var idPly = 6 + Math.floor(Math.random() * 4);
      state.flipped = opening.side === 'b';
      var distOps = shuffle(OPENINGS.filter(function (x) { return x.id !== opening.id; })).slice(0, 3);
      var idOpts = shuffle([opening].concat(distOps)).map(function (item) {
        return { label: opName(item) + ' (' + item.eco + ')', isRight: item.id === opening.id };
      });
      return {
        kind: 'identify',
        opening: opening,
        ply: idPly,
        pickedIdx: -1,
        options: idOpts,
        eyebrow: s.qIdentifyEyebrow,
        title: s.qIdentifyTitle,
        meta: s.actions.keysHint.split('·')[1] || '',
        cardTitle: s.qIdentifyTitle,
        cardHint: LANG === 'en' ? 'Examine pawn structure and piece placement on moves 3–5.' : 'Observa la estructura de peones y alfiles tras las primeras jugadas.'
      };
    }

    // plan
    var plPly = 8;
    state.flipped = opening.side === 'b';
    var rightPlan = opening['idea' + suf];
    var badPlans = opening['badPlans' + suf];
    var extraBad = shuffle(OPENINGS.filter(function (x) { return x.id !== opening.id; }))[0]['idea' + suf];
    var planOpts = shuffle([
      { label: rightPlan, isRight: true },
      { label: badPlans[0], isRight: false },
      { label: badPlans[1], isRight: false },
      { label: extraBad, isRight: false }
    ]);
    return {
      kind: 'plan',
      opening: opening,
      ply: plPly,
      pickedIdx: -1,
      options: planOpts,
      eyebrow: s.qPlanEyebrow,
      title: s.qPlanTitle,
      meta: '',
      cardTitle: s.qPlanTitle,
      cardHint: LANG === 'en' ? 'Analyze pawn breaks, open files, and King safety.' : 'Evalúa rupturas de peones, columnas abiertas y colocación de piezas.'
    };
  }

  function startRoundOrQuestion(resetRound) {
    if (resetRound) {
      state.roundAsk = 1;
      state.roundRight = 0;
      state.roundStart = state.mode === 'study' ? 0 : Date.now();
      state.frozenSec = null;
      state.totalCount = 0;
      state.rightCount = 0;
      state.streak = 0;
      updateStatsUI();
    }
    if (state.mode === 'test' && state.roundAsk > state.roundTarget) {
      renderStage();
      return;
    }
    state.answered = false;
    state.lastOk = false;
    state.selSq = null;
    state.question = makeQuestion();
    renderStage();
  }

  function flashStage(ok) {
    var box = $('stageBox');
    box.classList.remove('flash-ok', 'flash-bad');
    void box.offsetWidth;
    box.classList.add(ok ? 'flash-ok' : 'flash-bad');
    if (state.flashTimer) clearTimeout(state.flashTimer);
    state.flashTimer = setTimeout(function () {
      box.classList.remove('flash-ok', 'flash-bad');
    }, 450);
  }

  function recordOutcome(ok) {
    state.totalCount += 1;
    if (ok) {
      state.rightCount += 1;
      state.streak += 1;
      if (state.mode === 'test') state.roundRight += 1;
    } else {
      state.streak = 0;
    }
    updateStatsUI();
  }

  function submitBoardMove(moveUci) {
    var q = state.question;
    if (!q || state.answered) return;
    q.pickedUci = moveUci;
    q.pickedIdx = q.options.findIndex(function (o) { return o.uci === moveUci; });
    var ok = moveUci === q.rightUci;
    state.answered = true;
    state.lastOk = ok;
    recordOutcome(ok);
    flashStage(ok);
    renderStage();
  }

  function submitChoiceAnswer(idx) {
    var q = state.question;
    if (!q || state.answered) return;
    var opt = q.options[idx];
    if (!opt) return;
    q.pickedIdx = idx;
    if (opt.uci) q.pickedUci = opt.uci;
    var ok = !!opt.isRight;
    state.answered = true;
    state.lastOk = ok;
    recordOutcome(ok);
    flashStage(ok);
    renderStage();
  }

  function advanceQuestion() {
    if (!state.answered) return;
    if (state.mode === 'test') state.roundAsk += 1;
    startRoundOrQuestion(false);
  }

  function updateStatsUI() {
    var s = S();
    if (state.mode === 'play') {
      var pui = s.playUI;
      $('statAccLabel').textContent = pui.statClean;
      $('statTimeLabel').textContent = pui.statStreak;
      $('statStreakLabel').textContent = pui.statBest;
      $('sAcc').textContent = state.play.cleanGames + '/' + state.play.totalGames;
      $('sTime').textContent = String(state.play.streak);
      $('sStreak').textContent = String(state.play.best);
      return;
    }
    $('statAccLabel').textContent = s.statAccLabel;
    $('statTimeLabel').textContent = s.statTimeLabel;
    $('statStreakLabel').textContent = s.statStreakLabel;
    $('sAcc').textContent = state.totalCount ? Math.round((state.rightCount / state.totalCount) * 100) + '%' : '–';
    $('sTime').textContent = fmtClock(elapsedSec());
    $('sStreak').textContent = String(state.streak);
    var best = state.bests[state.block];
    $('best').innerHTML = best
      ? (s.actions.best + '<b>' + best.pct + '%</b> · ' + fmtClock(best.time))
      : s.actions.bestNone;
  }

  function toggleClean(on) {
    CLEAN = on === undefined ? !CLEAN : !!on;
    document.body.classList.toggle('clean', CLEAN);
  }

  function bindEvents() {
    $('langSel').addEventListener('change', function (e) { setLang(e.target.value); });

    window.addEventListener('storage', function (e) {
      if (e.key === 'todologo.lang' && (e.newValue === 'es' || e.newValue === 'en')) {
        setLang(e.newValue);
      }
    });

    $('modeSeg').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-v]');
      if (!btn) return;
      clearRivalTimer();
      state.mode = btn.getAttribute('data-v');
      STORE.set('mode', state.mode);
      applyStaticLabels();
      if (state.mode === 'play') {
        startPlayGame(null);
      } else if (state.mode === 'study') {
        state.roundStart = 0;
        state.frozenSec = null;
        updateStatsUI();
        renderStage();
      } else {
        startRoundOrQuestion(true);
      }
    });

    $('taskSeg').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-v]');
      if (!btn) return;
      state.task = btn.getAttribute('data-v');
      STORE.set('task', state.task);
      applyStaticLabels();
      if (state.mode !== 'study' && state.mode !== 'play') startRoundOrQuestion(state.mode === 'test');
    });

    $('restartBtn').addEventListener('click', function () {
      if (state.mode === 'play') {
        startPlayGame(null);
      } else if (state.mode === 'study') {
        state.ply = 0;
        state.showTrap = false;
        renderStage();
      } else {
        startRoundOrQuestion(true);
      }
    });

    // Play-mode sidebar controls
    $('playColorSeg').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-v]');
      if (!btn) return;
      state.play.color = btn.getAttribute('data-v');
      STORE.set('playColor', state.play.color);
      applyStaticLabels();
      if (state.mode === 'play') startPlayGame(null);
    });

    $('rivalSeg').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-v]');
      if (!btn) return;
      state.play.rival = btn.getAttribute('data-v');
      STORE.set('rival', state.play.rival);
      applyStaticLabels();
      if (state.mode === 'play') renderTopPrompt();
    });

    $('stopOnSeg').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-v]');
      if (!btn) return;
      state.play.stopOn = btn.getAttribute('data-v');
      STORE.set('stopOn', state.play.stopOn);
      applyStaticLabels();
    });

    $('openingSel').addEventListener('change', function (e) {
      state.play.openingFilter = e.target.value || 'any';
      STORE.set('openingFilter', state.play.openingFilter);
      applyStaticLabels();
      if (state.mode === 'play') startPlayGame(null);
    });

    $('durationSeg').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-v]');
      if (!btn) return;
      state.play.duration = Number(btn.getAttribute('data-v')) || 12;
      STORE.set('duration', state.play.duration);
      applyStaticLabels();
      if (state.mode === 'play') startPlayGame(null);
    });

    $('newGameBtn').addEventListener('click', function () {
      if (state.mode === 'play') startPlayGame(null);
    });

    function startFixMistake() {
      if (!state.play.mistakes.length) return;
      var nextMistake = state.play.mistakes[0];
      if (state.mode !== 'play') {
        state.mode = 'play';
        STORE.set('mode', 'play');
        applyStaticLabels();
      }
      startPlayGame(nextMistake);
    }
    $('fixMistakesBtn').addEventListener('click', startFixMistake);
    $('fixMistakesLeftBtn').addEventListener('click', startFixMistake);

    $('cleanBtn').addEventListener('click', function () { toggleClean(true); });
    $('cleanPlayBtn').addEventListener('click', function () { toggleClean(true); });
    $('cleanExit').addEventListener('click', function () { toggleClean(false); });
    $('settingsBtn').addEventListener('click', function () { document.body.classList.add('sheet-open'); });
    $('closeSheet').addEventListener('click', function () { document.body.classList.remove('sheet-open'); });
    $('howBtn').addEventListener('click', function () { $('intro').hidden = false; });
    $('introGo').addEventListener('click', function () {
      $('intro').hidden = true;
      STORE.set('seenIntro', true);
    });

    document.addEventListener('keydown', function (e) {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT')) return;
      if (!$('intro').hidden) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          $('intro').hidden = true;
          STORE.set('seenIntro', true);
        }
        return;
      }
      var kl = e.key.toLowerCase();
      if (kl === 'c') { toggleClean(); return; }
      if (kl === 'f') { state.flipped = !state.flipped; renderStage(); return; }
      if (kl === 't' && state.mode === 'study') { state.showTrap = !state.showTrap; renderStage(); return; }
      if (e.key === 'Escape' && CLEAN) { toggleClean(false); return; }

      if (state.mode === 'play') {
        if (kl === 'n') { e.preventDefault(); startPlayGame(null); }
        else if (kl === 't') { e.preventDefault(); undoAndRetryPlay(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); stepPlayLine(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); stepPlayLine(-1); }
        else if (e.key === 'Enter' || e.key === ' ') {
          var primPlay = document.querySelector('#actions .act.primary');
          if (primPlay) {
            e.preventDefault();
            if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
            primPlay.click();
          }
        }
        return;
      }

      if (state.mode === 'study') {
        if (e.key === 'ArrowRight') { e.preventDefault(); stepMove(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); stepMove(-1); }
        return;
      }

      if (state.answered) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          advanceQuestion();
        }
        return;
      }

      var k = Number(e.key) - 1;
      if (state.question && k >= 0 && k < state.question.options.length) {
        submitChoiceAnswer(k);
      }
    });
  }

  window.__CHESS_TRAINER__ = {
    OPENINGS: OPENINGS,
    BLOCKS: BLOCKS,
    ECO_BOOK: ECO_BOOK,
    MENU_OPENINGS: MENU_OPENINGS,
    BOOK: BOOK,
    getState: function () { return state; },
    createInitialState: createInitialState,
    applyUciMove: applyUciMove,
    boardAfterPlies: boardAfterPlies,
    getLegalTargets: getLegalTargets,
    allLegalMoves: allLegalMoves,
    moveToSan: moveToSan,
    detectOpening: detectOpening,
    lookupBookPosition: lookupBookPosition,
    winChance: winChance,
    analyzePosition: analyzePosition,
    startPlayGame: startPlayGame,
    submitPlayMove: submitPlayMove,
    undoAndRetryPlay: undoAndRetryPlay,
    applyRivalReplyNow: applyRivalReplyNow
  };

  function init() {
    applyStaticLabels();
    renderRail();
    bindEvents();
    if (!STORE.get('seenIntro', false)) $('intro').hidden = false;
    if (state.mode === 'play') startPlayGame(null);
    else if (state.mode === 'study') renderStage();
    else startRoundOrQuestion(true);
  }

  init();
})();
