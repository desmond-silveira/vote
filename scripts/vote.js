$(document).ready(function () {
  $('#blt').change(function (event) {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      let text;
      reader.onload = function () {
        text = reader.result;
        $('#blt-content').html(`<pre>${text}</pre>`);
        $('#results').html(getResultsHtml(countStv(new BltFile(text))));
      };
      reader.readAsText(this.files[0]);
    }
  });
});

function getResultsHtml(results) {
  let resultsHtml = `<h1>${results.blt.title}</h1>\n`
      + `<p>Candidates: ${results.blt.candidateCount}</br>\n`
      + `Vacant seats: ${results.blt.seatCount}</p>\n`;
  if (results.blt.withdrawn.length > 0) {
    resultsHtml += '<p>Withdrawn Candidates:</p>\n<ul>\n';
    for (const candidate of results.blt.withdrawn) {
      resultsHtml += ` <li>${Candidate.map.get(candidate).name}</li>\n`;
    }
    resultsHtml += '</ul>\n';
  }
  for (let i = 0; i < results.rounds.length; i++) {
    resultsHtml += getRoundTable(i + 1, results.rounds[i], results.blt.candidates);
  }
  return resultsHtml;
}

function getRoundTable(roundNumber, round, candidates) {
  let roundTable = `\n<table>\n`
      + `<caption>Round ${roundNumber} (quota = ${round.quota})</caption>`;
  roundTable += '<tr><th>Candidates</th>';
  for (let i = 0; i < round.ctvv.length; i++) {
    roundTable += `<th>${roundNumber}.${i}</th>`;
  }
  roundTable += '</tr>\n';
  for (const candidate of candidates) {
    roundTable += `<tr><th>${candidate.name}</th>`
        + getCtvvCells(round.ctvv, candidate.i, round.excluded, round.provisionals)
        + '</tr>\n';
  }
  roundTable += `<tr><th>Exhausted</th>`
      + getCtvvCells(round.ctvv, 0, round.excluded, round.provisionals)
      + '</tr>\n';
  roundTable += '</table>';
  return roundTable;
}

function getCtvvCells(ctvv, candidate, excluded, provisionals) {
  let ctvvCells = '';
  for (let i = 0; i < ctvv.length; i++) {
    ctvvCells += '<td';
    if (excluded[i] && excluded[i].includes(candidate)) {
      ctvvCells += ' class="excluded"';
    } else if (provisionals[i] == candidate) {
      ctvvCells += ' class="elected"';
    }
    ctvvCells += `>${ctvv[i].get(candidate)}</td>`;
  }
  return ctvvCells;
}