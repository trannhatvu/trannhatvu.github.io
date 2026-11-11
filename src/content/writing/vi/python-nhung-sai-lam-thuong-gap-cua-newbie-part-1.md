---
title: "Python: Những sai lầm thường gặp của newbie, Part 1"
description: "July 6, 2013 Bài viết này từ vài năm trước, một số chi tiết (theo ý kiến của tôi) có thể đã lỗi thời. Tôi vẫn mong muốn nghe những phản hồi của các bạn tại phần bình luận dưới đây. Enjoy! Trong vài th…"
date: 2017-08-25
lang: vi
kind: article
tags: ["Công nghệ"]
translationKey: "wordpress-558"
draft: false
starter: false
---


<div class="wp-block-image"><figure class="aligncenter size-large is-resized"><a href="/images/wordpress/python.png"><img loading="lazy" data-attachment-id="556" data-permalink="https://rainipetitcoin.wordpress.com/2017/08/25/giai-ngo-entry-points-trong-python/python/" data-orig-file="https://rainipetitcoin.wordpress.com/wp-content/uploads/2017/08/python.png" data-orig-size="651,651" data-comments-opened="1" data-image-title="Python" data-image-description="" data-image-caption="" data-large-file="https://rainipetitcoin.wordpress.com/wp-content/uploads/2017/08/python.png?w=651" src="/images/wordpress/python.png" alt="" class="wp-image-556" width="166" height="166" /></a></figure></div>


<div class="center">
<p>July 6, 2013</p>
</div>
<p><small><i>Bài viết này từ vài năm trước, một số chi tiết (theo ý kiến của tôi) có thể đã lỗi thời.&nbsp;</i></small><small><i>Tôi vẫn mong muốn nghe những phản hồi của các bạn tại phần bình luận dưới đây. Enjoy!</i></small></p>
<div class="divider"></div>
<div>Trong vài tháng gần đây, tôi đã giúp vài người mới với Python tìm hiểu ngôn ngữ này. Tôi nhận thấy rằng có một vài &#8220;bẫy&#8217; mà hầu hết mọi người gặp phải khi họ mới tiếp xúc với nó, nên tôi quyết định chia sẻ ý kiến của mình với các bạn. Mỗi phần của series này sẽ tập trung vào một sai lầm chung khác nhau, mô tả nguyên nhân và đưa ra giải pháp.</div>
<p></p>
<h1>Sử dụng giá trị có thể thay đổi (mutable) làm giá định mặc định (default)</h1>
<p>Đây chắn chắn xứng đáng chiếm ngôi đầu của danh sách. Không chỉ vì lý do là &#8220;bug&#8221; này khó phát hiện, nó cũng rất khó để debug. Xét đoạn snippet sau đây&nbsp;<span style="font-size:0.8em;background:#c1c1c1;color:#ffffff;font-weight:bold;display:inline-block;padding:0 12px;vertical-align:1px;line-height:18px;cursor:pointer;margin:0 2px;transition:background 0.3s;">1</span>:</p>


```python
def foo(numbers=[]):
    numbers.append(9)
    print numbers
```


<p>Vậy chúng ta lấy một list (mặc định là list rỗng), thêm 9 vào và hiển thị nó ra.</p>


```python
>>> foo()
[9]
>>> foo(numbers=[1,2])
[1, 2, 9]
>>> foo(numbers=[1,2,3])
[1, 2, 3, 9]
```


<p>Trông có vẻ ổn, đúng không ? Trừ việc điều này xảy ra khi chúng ta gọi&nbsp;<code>foo</code>&nbsp;không có số:</p>


```python
>>> foo() # first time, like before
[9]
>>> foo() # second time
[9, 9]
>>> foo() # third time...
[9, 9, 9]
>>> foo() # WHAT IS THIS BLACK MAGIC?!
[9, 9, 9, 9]
```


<p>Vậy điều gì đã xảy ra ở đây ?</p>
<p>So what’s happening here? Bản năng của chúng ta bảo rằng bất cứ khi nào gọi <code>foo</code>&nbsp;không có&nbsp;<code>numbers</code>, thì&nbsp;<code>numbers</code>sẽ được gán với một list rỗng. Điều này sai. Giá trị mặc định của hàm trong Python là Default values for functions in Python được thể hiện khi hàm số được <em>định nghĩa</em>, không phải khi nó được&nbsp;<em>gọi.</em></p>
<p>Bạn vẫn thắc mắc, tại sao nó không giống với giá trị được tính toán trước mỗi khi tôi gọi hàm ? Well, mỗi lần bạn chỉ định một giá trị mặc định cho một hàm, Python lưu lại giá trị đó. Nếu bạn gọi hàm số và override giá trị mặc định đó, giá trị được lưu sẽ không được sử dụng. Khi bạn không override nó (như trong ví dụ của chúng ta), Python tạo tên mà bạn định nghĩa&nbsp;(<code>numbers</code>, trong trường hợp của chúng ta) tham chiếu đến giá trị được lưu. Nó không copy giá trị của biến. Đó có tể là một concept khó cho beginner, hãy tưởng tượng rắng thay vì 2 biến riêng biệt (một &#8211; nội bộ, giá trị khởi tạo ban đầu và cái còn lại, hiện tại &#8211; biến cục bộ). Thực tế, những gì chúng ta có là hai cái tên cho phép chúng ta tương tác với cùng một giá trị. Vậy khi <code>numbers</code>&nbsp;thay đổi, nó cũng thay đổi bộ nhớ chứa giá trị khởi tạo của Python.</p>
<p>Giải pháp ở đây&nbsp;<span style="font-size:0.8em;background:#c1c1c1;color:#ffffff;font-weight:bold;display:inline-block;padding:0 12px;vertical-align:1px;line-height:18px;cursor:pointer;margin:0 2px;transition:background 0.3s;font-family:'Fira Sans', sans-serif;font-style:normal;letter-spacing:normal;orphans:2;text-align:start;text-indent:0;text-transform:none;white-space:normal;widows:2;word-spacing:0;text-decoration-style:initial;text-decoration-color:initial;">2</span>:</p>


```python
def foo(numbers=None):
    if numbers is None:
        numbers = []
    numbers.append(9)
    print numbers
```


<p>Thường xuyên hơn không, khi mọi người nghe về điều này, họ hỏi làm thế nào để các giá trị mặc định khác làm việc như mong đợi. Xem xét điều này:</p>


```python
def foo(count=0):
    count += 1
    print count
```


<p>Khi chúng ta chạy, nó hoạt động chính xác như mong đợi:</p>


```python
>>> foo()
1
>>> foo()
1
>>> foo(2)
3
>>> foo(3)
4
>>> foo()
1
```


<p>Tại sao lại như thế ? &#8220;Bí mật&#8221; ở đây không phải là giá trị mặc định được gán mà chính là bản thân giá trị. Một số nguyên là một kiểu không đổi. Trong khi đó, như là list rỗng, nó được thực thi trong định nghĩa của hàm, nó không thể bị thay đổi. Khi chúng ta thực hiện&nbsp;<code>count += 1</code>&nbsp;chúng ta không thể thay đổi giá trị gốc của count. Chúng ta đơn giản chỉ làm cái tên <code>count</code>&nbsp;chỉ đển một giá trị khác. Tuy nhiên, khi chúng ta sử dụng&nbsp;<code>numbers.append(9)</code>&nbsp;chúng ta thay đổi list gốc. Vì thế, thật bối rối.</p>
<p>Sau đây là một thể loại khác cùng vấn đề khi bạn thử gọi một hàm như là giá trị mặc định:</p>


```python
def print_now(now=time.time()):
    print now
```


<p>Cũng như trước, trong khi giá trị của&nbsp;<code>time.time()</code>&nbsp;là không đổi, nó được tính toán chỉ khi hàm được định nghĩa, nên nó luôn trả về cùng thời gian &#8211; thời gian mà khi hàm được parse bởi Python:</p>


```python
>>> print_now()
1373121487.91
>>> print_now()
1373121487.91
>>> print_now()
1373121487.91
```


<h3>Đọc phần còn lại của series:</h3>
<ul>
<li>Part 1: Sử dụng giá trị có thể thay đổi (mutable) làm giá định mặc định (default)</li>
<li><a href="http://amir.rachum.com/blog/2013/07/09/python-common-newbie-mistakes-part-2/">Part 2: Scoping</a></li>
</ul>
<p style="text-align:right;"><em>Nguồn:&nbsp;</em><a href="http://amir.rachum.com/blog/2013/07/06/python-common-newbie-mistakes-part-1/" target="_blank" rel="noopener">Amir Rachum&#8217;s Blog</a></p>
