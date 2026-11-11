---
title: "[C++] Sử dụng callback với template"
description: Sử dụng template trong C++ để viết code trở nên tổng quát hơn là
  một kiến thức cơ bản của dev C++. Đối với người mới, template chủ yếu để sử
  dụng một hàm cho nhiều kiểu dữ liệu khác nhau.
date: 2021-07-08
lang: vi
kind: article
tags:
  - C++
translationKey: wordpress-906
draft: false
starter: false
---
Sử dụng template trong C++ để viết code trở nên tổng quát hơn là một kiến thức cơ bản của dev C++. Đối với người mới, template chủ yếu để sử dụng một hàm cho nhiều kiểu dữ liệu khác nhau.

```cpp
#include <iostream>
using namespace std;

// One function works for all data types.  This would work
// even for user defined types if operator '>' is overloaded
template <typename T>
T myMax(T x, T y)
{
   return (x > y)? x: y;
}

int main()
{
  cout << myMax<int>(3, 7) << endl;  // Call myMax for int
  cout << myMax<double>(3.0, 7.0) << endl; // call myMax for double
  cout << myMax<char>('g', 'e') << endl;   // call myMax for char

  return 0;
}
```



&nbsp;

Nhưng template có thể làm được nhiều hơn thế nữa. Chúng ta có 2 hàm A1 và A2 giống nhau 99%, chỉ khác nhau ở việc A1 gọi 1 hàm B1, còn A2 gọi 1 hàm B2.

Ý tưởng ở đây là chỉ cần viết một function A có thể gọi một function B, và B là một paramater.

```cpp
#include <iostream>

template<typename Function>
int AddOrSub(int a, int b, Function func)
{
    return func(a, b);
}

int Add(int a, int b)
{
    return a + b;
}

int Sub(int a, int b)
{
    return a - b;
}

int main()
{
    std::cout << AddOrSub(10, 5, Sub) << std::endl;
    std::cout << AddOrSub(10, 5, Add) << std::endl;
}
```

Output

```
5
15
```

Chú ý: Template là một tính năng ở compile-time, một công cụ để thiết kế tính đa hình ở compile-time.