# C++ Function Header

Zero dependency micro library to extract function headers data from C++ source code.

### Install

```
npm install cpp-function-header
```

### Running the tests

```
npm test
```

### Example

```
import {ExtractFunctionHeader} from "cpp-function-header";

let cppSource = `
#include<iostream>
using namespace std;

int f_add(int x, int y) {
  return x + y;
}

int main() {
  int z = add(1, 2);
  return 0;
}`;

let header = ExtractFunctionHeader('f_add', cppSource);
```

### Extraction's Result

```
interface FunctionParameter {
  name: string;
  type: string;
  dimensions: number;
}

interface FunctionHeader {
  functionName: string;
  returnType: string;
  parameters: FunctionParameter[];
}
```
