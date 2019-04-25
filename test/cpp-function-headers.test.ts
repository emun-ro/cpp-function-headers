import {ExtractFunctionHeader} from "../src/cpp-function-headers"

let code1 = `
#include<iostream>
using namespace std;

int add(int x, int y) {
  return x + y;
}
int   padded_sum ( int n ,  int  v[1][2] ) {
  return 23;
}
int main() {
  int x = 23;
  return 0;
}`;

let code2 = `
#include<iostream>
using namespace std;

void f1() {
  return;
}

void f2(int a, int b[]) {

}

int f3(char* c) {
  return 0;
}

int main() {
  return 0;
}`;


it('checks basic function header to match function name', () => {
  let header = ExtractFunctionHeader('add', code1);
  expect(header).not.toBeNull();
  expect(header.functionName).toBe('add');
  
  header = ExtractFunctionHeader('padded_sum', code1);
  expect(header.functionName).toBe('padded_sum');

  header = ExtractFunctionHeader('f1', code2);
  expect(header.functionName).toBe('f1');
});

it('should match parameter length', () => {
  let header = ExtractFunctionHeader('add', code1);
  expect(header.parameters.length).toBe(2);

  header = ExtractFunctionHeader('padded_sum', code1);
  expect(header.parameters.length).toBe(2);

  header = ExtractFunctionHeader('f1', code2);
  expect(header.parameters.length).toBe(0);
  
  header = ExtractFunctionHeader('f2', code2);
  expect(header.parameters.length).toBe(2);

  header = ExtractFunctionHeader('f3', code2);
  expect(header.parameters.length).toBe(1);
});

it('should return null if the function name is not found', () => {
  let header = ExtractFunctionHeader('fooBar', code1);
  expect(header).toBeNull();
});

it('should match parameter name', () => {
  let header = ExtractFunctionHeader('add', code1);
  expect(header.parameters[0].name).toBe('x');
  expect(header.parameters[1].name).toBe('y');

  header = ExtractFunctionHeader('padded_sum', code1);
  expect(header.parameters[0].name).toBe('n');
  expect(header.parameters[1].name).toBe('v');
  
  header = ExtractFunctionHeader('f2', code2);
  expect(header.parameters[0].name).toBe('a');
  expect(header.parameters[1].name).toBe('b');

  header = ExtractFunctionHeader('f3', code2);
  expect(header.parameters[0].name).toBe('c');
});

it('should match parameter type', () => {
  let header = ExtractFunctionHeader('add', code1);
  expect(header.parameters[0].type).toBe('int');
  // still, dimensionality is higher
  expect(header.parameters[1].type).toBe('int');

  header = ExtractFunctionHeader('padded_sum', code1);
  expect(header.parameters[0].type).toBe('int');
  expect(header.parameters[1].type).toBe('int[1][2]');
  
  header = ExtractFunctionHeader('f2', code2);
  expect(header.parameters[0].type).toBe('int');
  expect(header.parameters[1].type).toBe('int[]');

  header = ExtractFunctionHeader('f3', code2);
  expect(header.parameters[0].type).toBe('char*');
});

it('should match parameter dimensionality', () => {
  let header = ExtractFunctionHeader('add', code1);
  expect(header.parameters[0].dimensions).toBe(0);
  expect(header.parameters[1].dimensions).toBe(0);

  header = ExtractFunctionHeader('padded_sum', code1);
  expect(header.parameters[0].dimensions).toBe(0);
  expect(header.parameters[1].dimensions).toBe(2);
  
  header = ExtractFunctionHeader('f2', code2);
  expect(header.parameters[0].dimensions).toBe(0);
  expect(header.parameters[1].dimensions).toBe(1);

  header = ExtractFunctionHeader('f3', code2);
  expect(header.parameters[0].dimensions).toBe(0);
});

it('should match return type', () => {
  let header = ExtractFunctionHeader('add', code1);
  expect(header.returnType).toBe('int');

  header = ExtractFunctionHeader('padded_sum', code1);
  expect(header.returnType).toBe('int');

  header = ExtractFunctionHeader('f2', code2);
  expect(header.returnType).toBe('void');
  
  header = ExtractFunctionHeader('f3', code2);
  expect(header.returnType).toBe('int');
});