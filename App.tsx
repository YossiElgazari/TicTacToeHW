import React, { useState, useEffect } from 'react';
import {
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  ImageBackground
} from 'react-native';

const xImage = require('./assets/X.png');
const oImage = require('./assets/O.png');
const backgroundImage = require('./assets/background.jpg'); 

type Player = 'X' | 'O' | null;
type Winner = Player | 'Draw';

export default function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Winner>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    checkWinner();
  }, [board]);

  useEffect(() => {
    if (winner) {
      setModalVisible(true);
    }
  }, [winner]);

  const handlePress = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const checkWinner = () => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
    if (!board.includes(null) && !winner) setWinner('Draw');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setModalVisible(false);
  };

  const getPlayerImage = (player: Player) => (player === 'X' ? xImage : oImage);

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <SafeAreaView style={styles.overlay}>
        <Text style={styles.title}>X Mix Drix</Text>
        <View style={styles.board}>
          {board.map((player, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cell}
              onPress={() => handlePress(index)}>
              {player && <Image source={getPlayerImage(player)} style={styles.cellImage} />}
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.turnIndicator}>
          {winner ? 'Game Over' : `Player ${currentPlayer}'s turn`}
        </Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
              </Text>
              {winner !== 'Draw' && (
                <Image source={getPlayerImage(winner)} style={styles.winnerImage} />
              )}
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={resetGame}>
                <Text style={styles.textStyle}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <StatusBar/>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent', // Set background to transparent to show the image
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    color: 'black',
    marginBottom: 20,
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    fontFamily: 'monospace',
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  cell: {
    width: '33.33%',
    height: '33.33%',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  cellImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  turnIndicator: {
    fontSize: 28,
    marginBottom: 10,
    color: 'black',
    paddingLeft: 5,
    paddingRight: 5,
    fontFamily: 'monospace',
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  winnerImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
