const snippets = [
    {
        id: 1,
        title: "Binary Search",
        language: "CPP",
        description: "Binary Search Implementation",
        code: `#include <bits/stdc++.h> using namespace std; int main() { int arr[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}; int n = sizeof(arr) / sizeof(arr[0]);
               int target = 6; int low = 0, high = n - 1; int result = -1; while (low <= high) { int mid = low + (high - low) / 2; 
               int mid = low + (high - low) / 2; result = mid; break; } else if (arr[mid] < target) { low = mid + 1;
                } else { high = mid - 1; } } if (result != -1) { cout << "Element found at index: " << result << endl; } else { cout << "Element not found" << endl; }return 0; }`
    },

    {
        id: 2,
        title: "Two Sum",
        language: "CPP",
        description: "Calculation of Two Sum",
        code: `#include <bits/stdc++.h> using namespace std; int main() { 
               vector<int> nums = {2, 7, 11, 15}; int target = 9; unordered_map<int, int> numMap; 
               for (int i = 0; i < nums.size(); i++) { int complement = target - nums[i]; 
               if (numMap.find(complement) != numMap.end()) { 
               cout << "Indices: " << numMap[complement] << ", " << i << endl; return 0; } numMap[nums[i]] = i; } 
               cout << "No solution found" << endl; return 0; }` 
    },

    {
        id: 3,
        title: "Merge Sort",
        language: "JavaScript",
        description: "Merge Sort Implementation",
        code: `function mergeSort(arr) { if (arr.length <= 1) { 
              return arr; } const mid = Math.floor(arr.length / 2); 
              const left = arr.slice(0, mid); const right = arr.slice(mid); 
              return merge(mergeSort(left), mergeSort(right)); } function merge(left, right) { 
              const result = []; let i = 0; let j = 0; while (i < left.length && j < right.length) { 
              if (left[i] < right[j]) { result.push(left[i]); i++; } else { result.push(right[j]); j++; } } 
              return result.concat(left.slice(i)).concat(right.slice(j)); } const array = [38, 27, 43, 3, 9, 82, 10]; 
              console.log("Original array:", array); const sortedArray = mergeSort(array); console.log("Sorted array:", sortedArray);`
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

const getSnippetByID = (id) => {
    const snippet = snippets.find(snippet => snippet.id === parseInt(id));
    return snippet;
};

const getSnippetByLanguage = ( language ) => {
    const filteredSnippets = snippets.filter(snippet => snippet.language.toLowerCase() === language.toLowerCase());
    return filteredSnippets;
}

const updateSnippet = (id, updatedData) => {
    const snippetIndex = snippets.findIndex(snippet =>snippet.id === parseInt(id));

    if(!snippetIndex){
        return null;
    }

    Object.assign(snippets[snippetIndex], updatedData);
    return snippets[snippetIndex];
}

const deleteSnippet = (id) => {
    const snippetIndex = snippets.findIndex(snippet =>snippet.id === parseInt(id));

    if(snippetIndex === -1){
        return null;
    }

    return snippets.splice(snippetIndex, 1)[0];
}

module.exports = {
    getAllSnippets,
    createSnippet,
    getSnippetByID,
    getSnippetByLanguage,
    updateSnippet,
    deleteSnippet
};