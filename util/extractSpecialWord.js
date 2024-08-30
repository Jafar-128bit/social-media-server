const extractSpecialWord = (content = "") => {
    const hashList = content.match(/#\w+/g) || [];
    const mentionList = content.match(/@\w+/g) || [];

    return {
        hashList,
        mentionList
    }
}

module.exports = extractSpecialWord;