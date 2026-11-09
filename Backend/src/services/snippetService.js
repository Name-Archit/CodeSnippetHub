const snippets = [
    {
        id: 1,
        title: "Binary Search",
        language: "C++",
        description: "Binary Search Implementation"
    },

    {
        id: 2,
        title: "Two Sum",
        language: "CPP",
        description: "Calculation of Two Sum"
    },

    {
        id: 3,
        title: "Merge Sort",
        language: "JavaScript",
        description: "Merge Sort Implementation"
    }
];

const createSnippet = (snippetData) => {

    const newSnippet = {
        id: snippets.length > 0
            ? Math.max(...snippets.map(s => s.id)) + 1
            : 1,

        title: snippetData.title,
        language: snippetData.language,
        description: snippetData.description || "",
        code: snippetData.code
    };

    snippets.push(newSnippet);

    return newSnippet;
};

const getAllSnippets = () => {
    return snippets;
};

module.exports = {
    getAllSnippets,
    createSnippet
};