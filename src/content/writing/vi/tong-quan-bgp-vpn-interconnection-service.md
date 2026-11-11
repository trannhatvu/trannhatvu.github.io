---
title: "Tổng quan BGP VPN Interconnection Service"
description: "Giới thiệu BGP-based IP VPN network được sử dụng rộng rãi trong công nghiệp đặc biệt là cho các doanh nghiệp. Project này nhằm mục đích hỗ trợ inter-connection giữa L3VPNs và Neutron resources, như là…"
date: 2018-05-28
lang: vi
kind: article
tags: ["Công nghệ"]
translationKey: "wordpress-687"
draft: false
starter: false
---

<h2>Giới thiệu</h2>
<p>BGP-based IP VPN network được sử dụng rộng rãi trong công nghiệp đặc biệt là cho các doanh nghiệp. Project này nhằm mục đích hỗ trợ inter-connection giữa L3VPNs và Neutron resources, như là Network, Router và Port.</p>
<p>Một use-case điển hình như sau: một tenant đã có setup BGP IP VPN (một tập hợp các site bên ngoài) ngoài datacenter và họ muốn có thể kích hoạt việc thiết lập kết nối giữa các VM và các VPN site này.</p>
<p>Một nhu cầu tương tự khác là khi E-VPN được sử dụng để cung cấp interconnection giữa nhiều site, và kế thừa kiến trúc nền của protocol từ các BGP/MPLS IP VPN.</p>
<p>Service plugin này cho một API để kết nối các port Neutron Openstack, thường là các VM, thông qua Network và Router mà chúng được kết nối, với một IP VPN được định nghĩa bởi <a id="id1" class="reference internal" href="https://docs.openstack.org/networking-bgpvpn/latest/user/overview.html#rfc4364">[RFC4364]</a> (BGP/MPLS IP Virtual Private Networks) hoặc với một E-VPN <a id="id2" class="reference internal" href="https://docs.openstack.org/networking-bgpvpn/latest/user/overview.html#rfc7432">[RFC7432]</a>.</p>
<div id="alternatives-and-related-techniques" class="section">
<h3>Giải pháp thay thế và các vấn đề kỹ thuật liên quan</h3>
<p>Các kỹ thuật xây dựng VPN đã có sẵn, nhưng mục tiêu của đề xuất này là tạo khả năng kết nối chúng ta cần khi công nghệ BGP-based VPN đã được sử dụng bên ngoài một cloud OpenStack.</p>
</div>
<div id="reminder-on-bgp-vpns-and-route-targets" class="section">
<h4>Nhắc lại về BGP VPNs và Route Targets</h4>
<p>BGP-based VPN cho phép nhà mạng cung cấp dịch vụ VPN cho một khách hàng VPN, cung cấp kết nối độc lập giữa nhiều site của khách hàng này.</p>
<p>Không như IPSec hay SSL-based VPN, ví dụ, các VPN này thường không được build trên Internet, thường không được encrypt và việc tạo ra chúng không nằm trong tay end-user.</p>
<p>Nhắc lại về cách kết nối được xác định giữa các site của một VPN (VRFs)</p>
<p>Trong các BGP-based VPN, một tập hợp các identifier gọi là Route Target được liên kết với một VPN và trong trường hợp điển hình là nhận dạng VPN; chúng cũng có thể được sử dụng để build các VPN topologies khác như hub&#8217;n&#8217;spoke.</p>
<p>Mỗi VRF (Virtual Routing and Forwarding) trong một PE (Provider Edge router) nhập/xuất các route từ/đến Route Targets. Nếu một VRF nhập từ một Route Target, các BGP IP VPN route sẽ được import vào VRF này. Nếu một VRF xuất đến một Route Target, các route trong VRF sẽ được liên kết đến Route Target này và được BGP thông báo.</p>
</div>
<div id="mapping-between-pes-ces-and-neutron-constructs" class="section">
<h4>Mapping giữa PEs/CEs và cấu trúc Neutron</h4>
<p>Như đã nêu trong phần tổng quan, các các PE, CE (Customer Edge router), các VRF map với cấu trúc Neutron sẽ phụ thuộc vào backend driver được sử dụng cho service plugin này.</p>
<p>Ví dụ, với bagpipe driver hiện tại, các PE và VRF function sẽ được triển khai trên các compute node và các VM hoạt động như các CE. PE function này sẽ BGP-peer với các edge IP/MPLS router, BGP Route Reflector hoặc các PE khác.</p>
<p>Bagpipe BGP thực hiện các function này cũng có thể được khởi tạo trong network node, tại l3agent level, với một BGP speaker trên mỗi l3agent, router namespace có thể được coi là các CE.</p>
<p>Các backend khác có thể muốn xem router như một CE và điều kiểu một external PE để peer với service provider PE, dựa trên thông tin nhận được với API này. Điều này phụ thuộc vào backend để quản lý kết nối giữa CE và cloud provider PE.</p>
<p>Một option điển hình khác là driver giao công việc cho một SDN controller để điều khiển việc triển khai BGP quảng bá/tiêu thụ các BGP route liên quan và điều khiển từ xa các vswitch để thiết lập datapath phù hợp.</p>
</div>
<div id="api-and-workflows" class="section">
<h3>API và Workflows</h3>
<p>BGP VPN được triển khai và quản lý bởi các operator, đặc biệt để quản lý các identifier của Route Target kiểm soát sự độc lập giữa các VPN khác nhau. Bởi vì các BGP VPN parameter không thể được chọn bởi các tenant mà chỉ bởi admin. Ngoài ra, các nhà mạng có thể không muốn để lộ các giá trị thật của Route Target cho người dùng.</p>
<p>Hoạt động mà tenant được phép là liên kết một BGPVPN resource mà họ sở hữu với Neutron Network hoặc Router của mình.</p>
<p>Vì vậy, có 2 workflow, một cho admin, một cho tenant.</p>
<ul class="simple">
<li>Admin/Operator Workflow: Tạo một BGPVPN
<ul>
<li>cloud/network admin tạo một BGPVPN cho một tenant dựa trên contract và thông tin OSS về VPN cho tenant này</li>
<li>ở giai đoạn này, danh sách mạng liên kết và Router có thể trống</li>
</ul>
</li>
<li>Tenant Workflow: Liên kết một BGPVPN đến Networks và/hoặc Routers, theo yêu cầu
<ul>
<li>tenant liệt kê các BGPVPN mà nó có thể sử dụng</li>
<li>tenant liên kết một BGPVPN với một hoặc nhiều Networks hay Routers.</li>
</ul>
</li>
</ul>
<p>Sequence diagram summarizing these two workflows:</p>
</div>
<div id="component-architecture-overview" class="section">
<h3>Component architecture overview</h3>
<p>This diagram gives an overview of the architecture:</p>
<div></div>
</div>
<div id="references" class="section">
<h3>References</h3>
<table id="rfc4364" class="docutils citation" rules="none">
<colgroup>
<col /></colgroup>
<tbody valign="top">
<tr>
<td class="label"><a class="fn-backref" href="https://docs.openstack.org/networking-bgpvpn/latest/user/overview.html#id1">[RFC4364]</a></td>
<td>BGP/MPLS IP Virtual Private Networks (IP VPNs) <a class="reference external" href="http://tools.ietf.org/html/rfc4364">http://tools.ietf.org/html/rfc4364</a></td>
</tr>
</tbody>
</table>
<table id="rfc7432" class="docutils citation" rules="none">
<colgroup>
<col /></colgroup>
<tbody valign="top">
<tr>
<td class="label"><a class="fn-backref" href="https://docs.openstack.org/networking-bgpvpn/latest/user/overview.html#id2">[RFC7432]</a></td>
<td>BGP MPLS-Based Ethernet VPN (Ethernet VPNs, a.k.a E-VPN) <a class="reference external" href="http://tools.ietf.org/html/rfc7432">http://tools.ietf.org/html/rfc7432</a></td>
</tr>
</tbody>
</table>
</div>
