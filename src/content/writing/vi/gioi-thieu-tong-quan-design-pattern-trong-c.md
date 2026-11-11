---
title: "Giới thiệu tổng quan design pattern trong C++"
description: "Mục lục I. Giới thiệu Design pattern một khái niệm được lặp đi lặp lại khi chúng ta code. Chúng ta đều đã nghe nhiều về những mô hình này, nhưng thực sự chúng là gì? Chúng là những mô hình lý thuyết p…"
date: 2018-08-18
lang: vi
kind: article
tags: ["C++"]
translationKey: "wordpress-773"
draft: false
starter: false
---


<div class="wp-block-image"><figure class="aligncenter size-large"><a href="/images/wordpress/wp.png"><img loading="lazy" width="689" height="374" data-attachment-id="884" data-permalink="https://rainipetitcoin.wordpress.com/2018/08/18/gioi-thieu-tong-quan-design-pattern-trong-c/wp/" data-orig-file="https://rainipetitcoin.wordpress.com/wp-content/uploads/2018/08/wp.png" data-orig-size="689,374" data-comments-opened="1" data-image-title="WP" data-image-description="" data-image-caption="" data-large-file="https://rainipetitcoin.wordpress.com/wp-content/uploads/2018/08/wp.png?w=689" src="/images/wordpress/wp.png" alt="" class="wp-image-884" /></a></figure></div>


<p style="text-align:justify;">Mục lục</p>
<h2 style="text-align:justify;">I. Giới thiệu</h2>
<p style="text-align:justify;">Design pattern một khái niệm được lặp đi lặp lại khi chúng ta code. Chúng ta đều đã nghe nhiều về những mô hình này, nhưng thực sự chúng là gì?</p>
<blockquote><p>Chúng là những mô hình lý thuyết phù hợp để giải quyết được một vấn đề cụ thể.</p></blockquote>
<p style="text-align:justify;">Trong các phần sau của bài viết, các pattern thông dụng sẽ được trình bày với C++.</p>
<p></p>
<h2 style="text-align:justify;">II. Prototype</h2>
<p style="text-align:justify;">Định nghĩa: một prototype là một class với mục đích để được clone.</p>
<h3 style="text-align:justify;">II.1. Ví dụ tác dụng của prototype</h3>
<p style="text-align:justify;">Trong quá trình viết các chương trình, bạn sẽ phải khởi tạo các object với kích thước nhất quán trong bộ nhớ.</p>
<p style="text-align:justify;">Tạo một object lớn sẽ không có vấn đề gì. Nhưng tạo nhiều object cùng lúc sẽ có thể hủy hoại hiệu năng chương trình của bạn.</p>
<p style="text-align:justify;">Giải pháp là sao chép base object, prototype, để chỉnh sửa những đáp ứng cần thiết cho object mới.</p>
<p style="text-align:justify;">Một cách sử dụng khác là khả năng cho phép clone để nhân đôi các object poly-morph. Trên thực tế, để sử dụng copy constructor, cần phải biết rõ kiểu của object, điều không tồn tại khi chúng ta sử dụng dynamic polymorphic trong C++.</p>
<p style="text-align:justify;">Với phương pháp này, chúng ta nhận ra rằng pattern prototype có một method bắt buộc, Clone, và một tùy chọn Change. Cái đầu tiên là để thực hiện một copy prototype trong khi cái thứ hai có vai trò thay đổi trạng thái của object.</p>
<p style="text-align:justify;">Vậy, sơ đồ UML sẽ mô hình hóa pattern prototype như sau:</p>
<div style="width: 207px" class="wp-caption aligncenter"><a href="https://come-david.developpez.com/tutoriels/dps/fichiers/prototypeuml.png">Diagramme UML du DP prototype</a><p class="wp-caption-text">Sơ đồ UML của pattern prototype</p></div>
<h3 style="text-align:justify;">II.2. Ví dụ áp dụng sơ cấp</h3>
<p style="text-align:justify;">Sau phân tích ở trên và lấy ví dụ với một kết nối MySQL, áp dụng đầu tiên đối với pattern này có thể đơn giản như sau:</p>


```cpp
std::auto_ptr<MySQLManager> MySQLManager::Clone() const
{
    return std::auto_ptr<MySQLManager>(new MySQLManager(*this));
}

int main(void)
{
//main ne change pas, on est juste sûr que la mémoire sera libérée en cas de problème
}
```

Source: [prototype.cpp](https://gist.github.com/trannhatvu/0885a139c4f0d94434426076760e9949#file-prototype-cpp).

```cpp
//file prototype.h

#ifndef PROTOTYPE_H
#define PROTOTYPE_H

#include <string>

class Prototype
{
  public:
  virtual ~Prototype();
  virtual Prototype* Clone() const = 0;
};

class MySQLManager: public Prototype
{
  std::string m_host,m_login,m_pass;
  std::string m_base,m_table;
  public:
  MySQLManager(const std::string& host="",
               const std::string& login="",
               const std::string& pass="");
  MySQLManager* Clone() const;

  void Afficher();
  void Set(const std::string& base="",const std::string& table="");
};

#endif
```

Source: [prototype.h](https://gist.github.com/trannhatvu/0885a139c4f0d94434426076760e9949#file-prototype-h).

```cpp
//fichier prototypetpl.h

#ifndef PROTOTYPE_H
#define PROTOTYPE_H

#include <string>
#include <memory>

template <class T> class Prototype
{
public:
    virtual ~Prototype(){}
    virtual std::auto_ptr<T> Clone() const =0 ;
};

class MySQLManager: public Prototype<MySQLManager>
{

    std::string m_host,m_login,m_pass;
    std::string m_base,m_table;

public:
    MySQLManager(const std::string host="",const std::string login="",const std::string pass="");

    void Afficher() const ;
    std::auto_ptr<MySQLManager> Clone() const ;
    void Set(const std::string base="",const std::string table="");
};

#endif
```

Source: [prototypetpl.h](https://gist.github.com/trannhatvu/0885a139c4f0d94434426076760e9949#file-prototypetpl-h).

```cpp
#include <iostream>
#include "prototype.h"

Prototype::~Prototype()
{

}

MySQLManager::MySQLManager(const std::string& host,const std::string& login,const std::string& pass):
m_host(host),m_login(login),m_pass(pass)
{
//kết nối tới Mysql database
//điều này có thể hơi lâu vì cần phải kết nối và định danh
//Lourd.
}

MySQLManager* MySQLManager::Clone() const
{
//copy constructor thực thi công việc ở đây
return (new MySQLManager(*this));
}

void MySQLManager::Set(const std::string& base,const std::string& table)
{
m_base=base;
m_table=table;
//kết nối đến m_base để phân tích m_table
}
void MySQLManager::Afficher() const
{
std::cout<<m_host<<"|"<<m_login<<"|"<<m_host<<"|"<<m_pass<<"|"<<m_base<<"|"<<m_table<<std::endl;
}

int main(void)
{
MySQLManager manager1("localhost","Davidbrcz","motdepasse");
manager1.Set("faussebase","table1");
//ici manager1 est connecté sur localhost avec l'identifiant Davidbrcz sur la table table1 de faussebasse

manager1.Afficher();

//Maintenant, on doit travailler en parallèle sur table2 de faussebase2 toujours sur localhost.
//on crée donc un autre manager qu'on recupère avec un std::auto_ptr pour éviter de gérer la mémoire en cas de problème.
std::auto_ptr<MySQLManager> manager2(manager1.Clone());
//et ici manager2 est déjà connecté à localhost avec l'identifiant Davidbrcz.Pas besoin de se réidentifier.
manager2->Afficher();
manager2->Set("faussebase2","table2");
manager2->Afficher();

//on travaile ..

return 0;
}
```

Source: [protype.cpp](https://gist.github.com/trannhatvu/0885a139c4f0d94434426076760e9949#file-protype-cpp).



```cpp
#include <iostream>
#include "prototype.h"

Prototype::~Prototype()
{

}

MySQLManager::MySQLManager(const std::string& host,const std::string& login,const std::string& pass):
m_host(host),m_login(login),m_pass(pass)
{
//kết nối tới Mysql database
//điều này có thể hơi lâu vì cần phải kết nối và định danh
//Lourd.
}

MySQLManager* MySQLManager::Clone() const
{
//copy constructor thực thi công việc ở đây
return (new MySQLManager(*this));
}

void MySQLManager::Set(const std::string& base,const std::string& table)
{
m_base=base;
m_table=table;
//kết nối đến m_base để phân tích m_table
}
void MySQLManager::Afficher() const
{
std::cout<<m_host<<"|"<<m_login<<"|"<<m_host<<"|"<<m_pass<<"|"<<m_base<<"|"<<m_table<<std::endl;
}

int main(void)
{
MySQLManager manager1("localhost","Davidbrcz","motdepasse");
manager1.Set("faussebase","table1");
//ici manager1 est connecté sur localhost avec l'identifiant Davidbrcz sur la table table1 de faussebasse

manager1.Afficher();

//Maintenant, on doit travailler en parallèle sur table2 de faussebase2 toujours sur localhost.
//on crée donc un autre manager qu'on recupère avec un std::auto_ptr pour éviter de gérer la mémoire en cas de problème.
std::auto_ptr<MySQLManager> manager2(manager1.Clone());
//et ici manager2 est déjà connecté à localhost avec l'identifiant Davidbrcz.Pas besoin de se réidentifier.
manager2->Afficher();
manager2->Set("faussebase2","table2");
manager2->Afficher();

//on travaile ..

return 0;
}
```

Source: [protype.cpp](https://gist.github.com/trannhatvu/0885a139c4f0d94434426076760e9949#file-protype-cpp).

<p>Class này được thực hiện tức thời bằng cách xác định method Clone. Nhưng virtual function Prototype::Clone trả lại một Prototype. Chúng ta biết rằng kiểu trả về không phù hợp với định nghĩa của function. Trình biên dịch trên lý thuyết sẽ không bằng lòng với điều này.</p>
<p>Nhưng thực tế nó được thực thi trơn tru bởi&nbsp; vì các giá trị trả về co-variance (cùng kiểu).<br>
Để đơn giản, các giá trị trả về co-variance trong trường hợp mà giá trị trả về của một virtual function là một reference hoặc một con trỏ đến một class C. Do đó các class tái định nghĩa virtual function này có thể gửi lại một con trỏ hoặc một reference đến một class bắt nguồn từ C.</p>
<p>Đó là những gì diễn ra ở đây. MySQLManager bắt đầu từ Prototype nên MySQLManager::Clone có thể trả về một con trỏ tới một instance của MySQLManager.</p>
<p>Nhưng vấn đề ở đây là Clone trả về một con trỏ thô, sử dụng một con trỏ thông minh để xử lý nó không bắt buộc chút nào. Nếu người dùng sử dụng một con trỏ thô để quản lý bộ nhớ, điều này có thể gây ra sự cố để khôi phục bộ nhớ trong trường hợp ngoại lệ.</p>
<p>Nhưng vấn đề ở đây là Clone trả về một con trỏ thường, sử dụng một con trỏ thông minh để xử lý không bị bắt buộc. Nếu người dùng sử dụng một con trỏ thường để quản lý bộ nhớ, điều này có thể gây ra sự cố khi khôi phục bộ nhớ trong trường hợp hi hữu.</p>
<h3 style="text-align:justify;">II.3. Áp dụng với template</h3>
<p>Trả về đồng biến không hoạt động với con trỏ thông minh. Để giải quyết vấn đề này, chúng ta phải sử dụng các mẫu. Vì vậy, các lớp Prototype và MySQLManager trở thành:</p>
