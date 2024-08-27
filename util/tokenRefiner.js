exports.tokenRefiner = (str) => {
    const firstSpaceIndex = str.indexOf(' ');
    const stringWithoutFirstWord = str.substring(firstSpaceIndex + 1);
    const words = stringWithoutFirstWord.split(' ');
    return words[words.length - 1];
}