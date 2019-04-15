import {ExtractFunctionHeader} from "../src/cpp-function-headers"

let code1 = `
#include<iostream>
using namespace std;
int add(int x, int y) {
    return x + y;
}
int padded_sum(int n, int v[1][2]) {
  return 23;
}
int main() {
  int x = 23;
  return 0;
}`;


it('checks basic function header extraction', () => {
  let header = ExtractFunctionHeader('add', code1);
  expect(header).not.toBeNull();
  expect(header.parameters.length).toBe(2);
  expect(header.functionName).toBe('add');

  header = ExtractFunctionHeader('padded_sum', code1);
  expect(header.parameters.length).toBe(2);
  expect(header.functionName).toBe('padded_sum');
});

it('should return null if the function name is not found', () => {
  let header = ExtractFunctionHeader('fooBar', code1);
  expect(header).toBeNull();
});


