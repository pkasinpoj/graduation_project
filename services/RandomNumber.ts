let RandomNumber = {
    getRandomAnswer: (data = []) => {
        let ctr = data.length, temp, index;
        while (ctr > 0) {
            index = Math.floor(Math.random() * ctr);
            ctr--;
            temp = data[ctr];
            data[ctr] = data[index];
            data[index] = temp;
        }
        return data;
    }
}

export default RandomNumber