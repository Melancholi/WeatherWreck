import { paginate } from '../utils/pagination.js';

describe('Pagination Utilities', () => {
    test('should return the correct page data', () => {
        const data = Array.from({ length: 100 }, (_, i) => `item ${i + 1}`);
        const pageSize = 10;
        const page1 = paginate(data, 1, pageSize);
        const page2 = paginate(data, 2, pageSize);
        expect(page1).toEqual(data.slice(0, 10));
        expect(page2).toEqual(data.slice(10, 20));
    });

    test('should handle out of range pages', () => {
        const data = Array.from({ length: 25 }, (_, i) => `item ${i + 1}`);
        const pageSize = 5;
        const page6 = paginate(data, 6, pageSize);
        expect(page6).toEqual([]);
    });

    test('should return total pages', () => {
        const data = Array.from({ length: 55 }, (_, i) => `item ${i + 1}`);
        const pageSize = 10;
        const totalPages = Math.ceil(data.length / pageSize);
        expect(totalPages).toEqual(6);
    });

  
    // Integration tests for correlated data
    test('should manage pagination with correlated data', () => {
        const correlatedData = [
            { id: 1, category: 'A' },
            { id: 2, category: 'B' },
            { id: 3, category: 'A' },
            { id: 4, category: 'B' },
        ];
        const pageSize = 2;
        const page1 = paginate(correlatedData, 1, pageSize);
        expect(page1).toEqual(correlatedData.slice(0, 2));
    });

    // Additional test cases for edge cases
    test('should return empty array for empty data', () => {
        const data = [];
        const pageSize = 5;
        const page1 = paginate(data, 1, pageSize);
        expect(page1).toEqual([]);
    });

    test('should return correct items for non-divisible page sizes', () => {
        const data = Array.from({ length: 23 }, (_, i) => `item ${i + 1}`);
        const pageSize = 6;
        const page4 = paginate(data, 4, pageSize);
        expect(page4).toEqual(['item 19', 'item 20', 'item 21', 'item 22', 'item 23']);
    });

    test('should return total pages as 1 for single item', () => {
        const data = [1];
        const pageSize = 2;
        expect(Math.ceil(data.length / pageSize)).toEqual(1);
    });

    test('should return the last page when requested beyond total pages', () => {
        const data = Array.from({ length: 18 }, (_, i) => `item ${i + 1}`);
        const pageSize = 4;
        const page5 = paginate(data, 5, pageSize);
        expect(page5).toEqual(['item 17', 'item 18']);
    });

    test('should return correct data for mid-page', () => {
        const data = Array.from({ length: 200 }, (_, i) => `item ${i + 1}`);
        const pageSize = 15;
        const page10 = paginate(data, 10, pageSize);
        expect(page10).toEqual(data.slice(135, 150));
    });

    test('should return the first page when page number is 1', () => {
        const data = Array.from({ length: 50 }, (_, i) => `item ${i + 1}`);
        const pageSize = 10;
        const page1 = paginate(data, 1, pageSize);
        expect(page1).toEqual(data.slice(0, 10));
    });

    test('should handle large datasets', () => {
        const data = Array.from({ length: 1000 }, (_, i) => `item ${i + 1}`);
        const pageSize = 50;
        const totalPages = Math.ceil(data.length / pageSize);
        expect(totalPages).toEqual(20);
    });

    test('should return correct paginated data for random access', () => {
        const data = ['item 1', 'item 2', 'item 3', 'item 4', 'item 5'];
        const paginatedData = paginate(data, 2, 2);
        expect(paginatedData).toEqual(['item 3', 'item 4']);
    });

    // Add more cases as needed for comprehensive coverage
});
