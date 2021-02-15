module.exports = {
  getQuizQuestionState: function (quiz) {
    let teams = [];
    quiz.currentRound.points.teams.forEach((element) => {
      console.log(element);
      if (element.answer && element.answer != "" && element.answer != "Answering..." ) {
        teams.push({ _id: element._id, answer: element.answer });
      }
    });
    console.log(teams)
    return {
      question: quiz.currentQuestion,
      category: quiz.currentQuestion.category,
      teamsDone: teams,
      teams: quiz.teams,
    };
  },
  getScores: function (quiz) {
    const roundScores = quiz.rounds.map((round) => {
      console.log(round)
      return {
        name: round._id,
        scores: round.points.teams,
      };
    });
    return {
      teams: quiz.teams,
      roundScores: roundScores,
    };
  },
  endRoundAndDetermineTeamScores: function (quiz) {
    //Check all the total correct answers from all the teams
    //This can be used to compare and thus be able to score the teams
    const allTotalCorrectFromTeams = quiz.currentRound.points.teams
      .map((team) => {
        return team.totalCorrect;
      })
      .sort((a, b) => b - a);

    if (allTotalCorrectFromTeams.length < 3) {
      //At least 2 teams play but there are 4 different scores that could be given
      //So array length needs to be at least 4
      allTotalCorrectFromTeams.push(0);
    }

    //Score the round for each team
    quiz.currentRound.points.teams = quiz.currentRound.points.teams.map(
      (team) => {
        if (team.totalCorrect === allTotalCorrectFromTeams[0]) {
          team.score = 4;
        } else if (team.totalCorrect === allTotalCorrectFromTeams[1]) {
          team.score = 2;
        } else if (team.totalCorrect === allTotalCorrectFromTeams[2]) {
          team.score = 1;
        } else {
          team.score = 0.1;
        }
        return team
      }
    );

    //Add round score to totalscore
    quiz.teams = quiz.teams.map((team) => {
      quiz.currentRound.points.teams.forEach((roundTeam) => {
        if (team.name === roundTeam._id) {
          team.score += roundTeam.score;
        }
      });
      return team
    });
    
    //Add the round to the played rounds
    quiz.rounds.push(quiz.currentRound);
    
    quiz.currentRound = null;
    quiz.currentQuestion = null;
    
    return quiz;
  },
};
