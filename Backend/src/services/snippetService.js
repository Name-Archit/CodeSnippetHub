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

const getAllSnippets = () => {
    return snippets;
};

module.exports = {
    getAllSnippets
};