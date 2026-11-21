(function(){
const __GEO = (function(){
/* d3-geo and topojson-client by Mike Bostock (ISC license), bundled for Capital Atlas */
var D=class{constructor(){this._partials=new Float64Array(32),this._n=0}add(n){let e=this._partials,r=0;for(let o=0;o<this._n&&o<32;o++){let i=e[o],u=n+i,l=Math.abs(n)<Math.abs(i)?n-(u-i):i-(u-n);l&&(e[r++]=l),n=u}return e[r]=n,this._n=r+1,this}valueOf(){let n=this._partials,e=this._n,r,o,i,u=0;if(e>0){for(u=n[--e];e>0&&(r=u,o=n[--e],u=r+o,i=o-(u-r),!i););e>0&&(i<0&&n[e-1]<0||i>0&&n[e-1]>0)&&(o=i*2,r=u+o,o==r-u&&(u=r))}return u}};function*$e(t){for(let n of t)yield*n}function At(t){return Array.from($e(t))}function dt(t,n,e){t=+t,n=+n,e=(o=arguments.length)<2?(n=t,t=0,1):o<3?1:+e;for(var r=-1,o=Math.max(0,Math.ceil((n-t)/e))|0,i=new Array(o);++r<o;)i[r]=t+r*e;return i}var P=1e-6,yt=1e-12,I=Math.PI,J=I/2,Ct=I/4,W=I*2,F=180/I,y=I/180,q=Math.abs,vr=Math.atan,Z=Math.atan2,S=Math.cos,$t=Math.ceil;var nn=Math.hypot;var x=Math.sin,xr=Math.sign||function(t){return t>0?1:t<0?-1:0},X=Math.sqrt;function Er(t){return t>1?0:t<-1?I:Math.acos(t)}function j(t){return t>1?J:t<-1?-J:Math.asin(t)}function Ln(t){return(t=x(t/2))*t}function z(){}function rn(t,n){t&&Sr.hasOwnProperty(t.type)&&Sr[t.type](t,n)}var yr={Feature:function(t,n){rn(t.geometry,n)},FeatureCollection:function(t,n){for(var e=t.features,r=-1,o=e.length;++r<o;)rn(e[r].geometry,n)}},Sr={Sphere:function(t,n){n.sphere()},Point:function(t,n){t=t.coordinates,n.point(t[0],t[1],t[2])},MultiPoint:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)t=e[r],n.point(t[0],t[1],t[2])},LineString:function(t,n){zn(t.coordinates,n,0)},MultiLineString:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)zn(e[r],n,0)},Polygon:function(t,n){wr(t.coordinates,n)},MultiPolygon:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)wr(e[r],n)},GeometryCollection:function(t,n){for(var e=t.geometries,r=-1,o=e.length;++r<o;)rn(e[r],n)}};function zn(t,n,e){var r=-1,o=t.length-e,i;for(n.lineStart();++r<o;)i=t[r],n.point(i[0],i[1],i[2]);n.lineEnd()}function wr(t,n){var e=-1,r=t.length;for(n.polygonStart();++e<r;)zn(t[e],n,1);n.polygonEnd()}function U(t,n){t&&yr.hasOwnProperty(t.type)?yr[t.type](t,n):rn(t,n)}var Dt=new D,en=new D,Pr,Mr,_n,Gn,Fn,at={point:z,lineStart:z,lineEnd:z,polygonStart:function(){Dt=new D,at.lineStart=De,at.lineEnd=ke},polygonEnd:function(){var t=+Dt;en.add(t<0?W+t:t),this.lineStart=this.lineEnd=this.point=z},sphere:function(){en.add(W)}};function De(){at.point=Be}function ke(){Rr(Pr,Mr)}function Be(t,n){at.point=Rr,Pr=t,Mr=n,t*=y,n*=y,_n=t,Gn=S(n=n/2+Ct),Fn=x(n)}function Rr(t,n){t*=y,n*=y,n=n/2+Ct;var e=t-_n,r=e>=0?1:-1,o=r*e,i=S(n),u=x(n),l=Fn*u,m=Gn*i+l*S(o),p=l*r*x(o);Dt.add(Z(p,m)),_n=t,Gn=i,Fn=u}function Ar(t){return en=new D,U(t,at),en*2}function St(t){return[Z(t[1],t[0]),j(t[2])]}function it(t){var n=t[0],e=t[1],r=S(e);return[r*S(n),r*x(n),x(e)]}function kt(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]}function mt(t,n){return[t[1]*n[2]-t[2]*n[1],t[2]*n[0]-t[0]*n[2],t[0]*n[1]-t[1]*n[0]]}function on(t,n){t[0]+=n[0],t[1]+=n[1],t[2]+=n[2]}function Bt(t,n){return[t[0]*n,t[1]*n,t[2]*n]}function wt(t){var n=X(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);t[0]/=n,t[1]/=n,t[2]/=n}var B,nt,Y,et,Pt,Ir,Lr,qt,Xt,vt,gt,ht={point:Tn,lineStart:Cr,lineEnd:qr,polygonStart:function(){ht.point=_r,ht.lineStart=Xe,ht.lineEnd=Ye,Xt=new D,at.polygonStart()},polygonEnd:function(){at.polygonEnd(),ht.point=Tn,ht.lineStart=Cr,ht.lineEnd=qr,Dt<0?(B=-(Y=180),nt=-(et=90)):Xt>P?et=90:Xt<-P&&(nt=-90),gt[0]=B,gt[1]=Y},sphere:function(){B=-(Y=180),nt=-(et=90)}};function Tn(t,n){vt.push(gt=[B=t,Y=t]),n<nt&&(nt=n),n>et&&(et=n)}function zr(t,n){var e=it([t*y,n*y]);if(qt){var r=mt(qt,e),o=[r[1],-r[0],0],i=mt(o,r);wt(i),i=St(i);var u=t-Pt,l=u>0?1:-1,m=i[0]*F*l,p,a=q(u)>180;a^(l*Pt<m&&m<l*t)?(p=i[1]*F,p>et&&(et=p)):(m=(m+360)%360-180,a^(l*Pt<m&&m<l*t)?(p=-i[1]*F,p<nt&&(nt=p)):(n<nt&&(nt=n),n>et&&(et=n))),a?t<Pt?rt(B,t)>rt(B,Y)&&(Y=t):rt(t,Y)>rt(B,Y)&&(B=t):Y>=B?(t<B&&(B=t),t>Y&&(Y=t)):t>Pt?rt(B,t)>rt(B,Y)&&(Y=t):rt(t,Y)>rt(B,Y)&&(B=t)}else vt.push(gt=[B=t,Y=t]);n<nt&&(nt=n),n>et&&(et=n),qt=e,Pt=t}function Cr(){ht.point=zr}function qr(){gt[0]=B,gt[1]=Y,ht.point=Tn,qt=null}function _r(t,n){if(qt){var e=t-Pt;Xt.add(q(e)>180?e+(e>0?360:-360):e)}else Ir=t,Lr=n;at.point(t,n),zr(t,n)}function Xe(){at.lineStart()}function Ye(){_r(Ir,Lr),at.lineEnd(),q(Xt)>P&&(B=-(Y=180)),gt[0]=B,gt[1]=Y,qt=null}function rt(t,n){return(n-=t)<0?n+360:n}function Oe(t,n){return t[0]-n[0]}function Nr(t,n){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}function Gr(t){var n,e,r,o,i,u,l;if(et=Y=-(B=nt=1/0),vt=[],U(t,ht),e=vt.length){for(vt.sort(Oe),n=1,r=vt[0],i=[r];n<e;++n)o=vt[n],Nr(r,o[0])||Nr(r,o[1])?(rt(r[0],o[1])>rt(r[0],r[1])&&(r[1]=o[1]),rt(o[0],r[1])>rt(r[0],r[1])&&(r[0]=o[0])):i.push(r=o);for(u=-1/0,e=i.length-1,n=0,r=i[e];n<=e;r=o,++n)o=i[n],(l=rt(r[1],o[0]))>u&&(u=l,B=o[0],Y=r[1])}return vt=gt=null,B===1/0||nt===1/0?[[NaN,NaN],[NaN,NaN]]:[[B,nt],[Y,et]]}var Yt,an,fn,un,ln,sn,cn,pn,$n,Dn,kn,$r,Dr,K,Q,V,ft={sphere:z,point:Bn,lineStart:Fr,lineEnd:Tr,polygonStart:function(){ft.lineStart=He,ft.lineEnd=je},polygonEnd:function(){ft.lineStart=Fr,ft.lineEnd=Tr}};function Bn(t,n){t*=y,n*=y;var e=S(n);Ot(e*S(t),e*x(t),x(n))}function Ot(t,n,e){++Yt,fn+=(t-fn)/Yt,un+=(n-un)/Yt,ln+=(e-ln)/Yt}function Fr(){ft.point=Ze}function Ze(t,n){t*=y,n*=y;var e=S(n);K=e*S(t),Q=e*x(t),V=x(n),ft.point=We,Ot(K,Q,V)}function We(t,n){t*=y,n*=y;var e=S(n),r=e*S(t),o=e*x(t),i=x(n),u=Z(X((u=Q*i-V*o)*u+(u=V*r-K*i)*u+(u=K*o-Q*r)*u),K*r+Q*o+V*i);an+=u,sn+=u*(K+(K=r)),cn+=u*(Q+(Q=o)),pn+=u*(V+(V=i)),Ot(K,Q,V)}function Tr(){ft.point=Bn}function He(){ft.point=Ue}function je(){kr($r,Dr),ft.point=Bn}function Ue(t,n){$r=t,Dr=n,t*=y,n*=y,ft.point=kr;var e=S(n);K=e*S(t),Q=e*x(t),V=x(n),Ot(K,Q,V)}function kr(t,n){t*=y,n*=y;var e=S(n),r=e*S(t),o=e*x(t),i=x(n),u=Q*i-V*o,l=V*r-K*i,m=K*o-Q*r,p=nn(u,l,m),a=j(p),f=p&&-a/p;$n.add(f*u),Dn.add(f*l),kn.add(f*m),an+=a,sn+=a*(K+(K=r)),cn+=a*(Q+(Q=o)),pn+=a*(V+(V=i)),Ot(K,Q,V)}function Br(t){Yt=an=fn=un=ln=sn=cn=pn=0,$n=new D,Dn=new D,kn=new D,U(t,ft);var n=+$n,e=+Dn,r=+kn,o=nn(n,e,r);return o<yt&&(n=sn,e=cn,r=pn,an<P&&(n=fn,e=un,r=ln),o=nn(n,e,r),o<yt)?[NaN,NaN]:[Z(e,n)*F,j(r/o)*F]}function Zt(t,n){function e(r,o){return r=t(r,o),n(r[0],r[1])}return t.invert&&n.invert&&(e.invert=function(r,o){return r=n.invert(r,o),r&&t.invert(r[0],r[1])}),e}function Xn(t,n){return q(t)>I&&(t-=Math.round(t/W)*W),[t,n]}Xn.invert=Xn;function Yn(t,n,e){return(t%=W)?n||e?Zt(Yr(t),Or(n,e)):Yr(t):n||e?Or(n,e):Xn}function Xr(t){return function(n,e){return n+=t,q(n)>I&&(n-=Math.round(n/W)*W),[n,e]}}function Yr(t){var n=Xr(t);return n.invert=Xr(-t),n}function Or(t,n){var e=S(t),r=x(t),o=S(n),i=x(n);function u(l,m){var p=S(m),a=S(l)*p,f=x(l)*p,s=x(m),c=s*e+a*r;return[Z(f*o-c*i,a*e-s*r),j(c*o+f*i)]}return u.invert=function(l,m){var p=S(m),a=S(l)*p,f=x(l)*p,s=x(m),c=s*o-f*i;return[Z(f*o+s*i,a*e+c*r),j(c*e-a*r)]},u}function Zr(t){t=Yn(t[0]*y,t[1]*y,t.length>2?t[2]*y:0);function n(e){return e=t(e[0]*y,e[1]*y),e[0]*=F,e[1]*=F,e}return n.invert=function(e){return e=t.invert(e[0]*y,e[1]*y),e[0]*=F,e[1]*=F,e},n}function Hr(t,n,e,r,o,i){if(e){var u=S(n),l=x(n),m=r*e;o==null?(o=n+r*W,i=n-m/2):(o=Wr(u,o),i=Wr(u,i),(r>0?o<i:o>i)&&(o+=r*W));for(var p,a=o;r>0?a>i:a<i;a-=m)p=St([u,-l*S(a),-l*x(a)]),t.point(p[0],p[1])}}function Wr(t,n){n=it(n),n[0]-=t,wt(n);var e=Er(-n[1]);return((-n[2]<0?-e:e)+W-P)%W}function dn(){var t=[],n;return{point:function(e,r,o){n.push([e,r,o])},lineStart:function(){t.push(n=[])},lineEnd:z,rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))},result:function(){var e=t;return t=[],n=null,e}}}function Nt(t,n){return q(t[0]-n[0])<P&&q(t[1]-n[1])<P}function mn(t,n,e,r){this.x=t,this.z=n,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}function hn(t,n,e,r,o){var i=[],u=[],l,m;if(t.forEach(function(d){if(!((M=d.length-1)<=0)){var M,v=d[0],E=d[M],R;if(Nt(v,E)){if(!v[2]&&!E[2]){for(o.lineStart(),l=0;l<M;++l)o.point((v=d[l])[0],v[1]);o.lineEnd();return}E[0]+=2*P}i.push(R=new mn(v,d,null,!0)),u.push(R.o=new mn(v,null,R,!1)),i.push(R=new mn(E,d,null,!1)),u.push(R.o=new mn(E,null,R,!0))}}),!!i.length){for(u.sort(n),jr(i),jr(u),l=0,m=u.length;l<m;++l)u[l].e=e=!e;for(var p=i[0],a,f;;){for(var s=p,c=!0;s.v;)if((s=s.n)===p)return;a=s.z,o.lineStart();do{if(s.v=s.o.v=!0,s.e){if(c)for(l=0,m=a.length;l<m;++l)o.point((f=a[l])[0],f[1]);else r(s.x,s.n.x,1,o);s=s.n}else{if(c)for(a=s.p.z,l=a.length-1;l>=0;--l)o.point((f=a[l])[0],f[1]);else r(s.x,s.p.x,-1,o);s=s.p}s=s.o,a=s.z,c=!c}while(!s.v);o.lineEnd()}}}function jr(t){if(n=t.length){for(var n,e=0,r=t[0],o;++e<n;)r.n=o=t[e],o.p=r,r=o;r.n=o=t[0],o.p=r}}function On(t){return q(t[0])<=I?t[0]:xr(t[0])*((q(t[0])+I)%W-I)}function gn(t,n){var e=On(n),r=n[1],o=x(r),i=[x(e),-S(e),0],u=0,l=0,m=new D;o===1?r=J+P:o===-1&&(r=-J-P);for(var p=0,a=t.length;p<a;++p)if(s=(f=t[p]).length)for(var f,s,c=f[s-1],d=On(c),M=c[1]/2+Ct,v=x(M),E=S(M),R=0;R<s;++R,d=w,v=N,E=T,c=g){var g=f[R],w=On(g),A=g[1]/2+Ct,N=x(A),T=S(A),_=w-d,G=_>=0?1:-1,k=G*_,C=k>I,b=v*N;if(m.add(Z(b*G*x(k),E*T+b*S(k))),u+=C?_+G*W:_,C^d>=e^w>=e){var O=mt(it(c),it(g));wt(O);var $=mt(i,O);wt($);var h=(C^_>=0?-1:1)*j($[2]);(r>h||r===h&&(O[0]||O[1]))&&(l+=C^_>=0?1:-1)}}return(u<-P||u<P&&m<-yt)^l&1}function vn(t,n,e,r){return function(o){var i=n(o),u=dn(),l=n(u),m=!1,p,a,f,s={point:c,lineStart:M,lineEnd:v,polygonStart:function(){s.point=E,s.lineStart=R,s.lineEnd=g,a=[],p=[]},polygonEnd:function(){s.point=c,s.lineStart=M,s.lineEnd=v,a=At(a);var w=gn(p,r);a.length?(m||(o.polygonStart(),m=!0),hn(a,Ke,w,e,o)):w&&(m||(o.polygonStart(),m=!0),o.lineStart(),e(null,null,1,o),o.lineEnd()),m&&(o.polygonEnd(),m=!1),a=p=null},sphere:function(){o.polygonStart(),o.lineStart(),e(null,null,1,o),o.lineEnd(),o.polygonEnd()}};function c(w,A){t(w,A)&&o.point(w,A)}function d(w,A){i.point(w,A)}function M(){s.point=d,i.lineStart()}function v(){s.point=c,i.lineEnd()}function E(w,A){f.push([w,A]),l.point(w,A)}function R(){l.lineStart(),f=[]}function g(){E(f[0][0],f[0][1]),l.lineEnd();var w=l.clean(),A=u.result(),N,T=A.length,_,G,k;if(f.pop(),p.push(f),f=null,!!T){if(w&1){if(G=A[0],(_=G.length-1)>0){for(m||(o.polygonStart(),m=!0),o.lineStart(),N=0;N<_;++N)o.point((k=G[N])[0],k[1]);o.lineEnd()}return}T>1&&w&2&&A.push(A.pop().concat(A.shift())),a.push(A.filter(Je))}}return s}}function Je(t){return t.length>1}function Ke(t,n){return((t=t.x)[0]<0?t[1]-J-P:J-t[1])-((n=n.x)[0]<0?n[1]-J-P:J-n[1])}var Zn=vn(function(){return!0},Qe,be,[-I,-J]);function Qe(t){var n=NaN,e=NaN,r=NaN,o;return{lineStart:function(){t.lineStart(),o=1},point:function(i,u){var l=i>0?I:-I,m=q(i-n);q(m-I)<P?(t.point(n,e=(e+u)/2>0?J:-J),t.point(r,e),t.lineEnd(),t.lineStart(),t.point(l,e),t.point(i,e),o=0):r!==l&&m>=I&&(q(n-r)<P&&(n-=r*P),q(i-l)<P&&(i-=l*P),e=Ve(n,e,i,u),t.point(r,e),t.lineEnd(),t.lineStart(),t.point(l,e),o=0),t.point(n=i,e=u),r=l},lineEnd:function(){t.lineEnd(),n=e=NaN},clean:function(){return 2-o}}}function Ve(t,n,e,r){var o,i,u=x(t-e);return q(u)>P?vr((x(n)*(i=S(r))*x(e)-x(r)*(o=S(n))*x(t))/(o*i*u)):(n+r)/2}function be(t,n,e,r){var o;if(t==null)o=e*J,r.point(-I,o),r.point(0,o),r.point(I,o),r.point(I,0),r.point(I,-o),r.point(0,-o),r.point(-I,-o),r.point(-I,0),r.point(-I,o);else if(q(t[0]-n[0])>P){var i=t[0]<n[0]?I:-I;o=e*i/2,r.point(-i,o),r.point(0,o),r.point(i,o)}else r.point(n[0],n[1])}function Ur(t){var n=S(t),e=2*y,r=n>0,o=q(n)>P;function i(a,f,s,c){Hr(c,t,e,s,a,f)}function u(a,f){return S(a)*S(f)>n}function l(a){var f,s,c,d,M;return{lineStart:function(){d=c=!1,M=1},point:function(v,E){var R=[v,E],g,w=u(v,E),A=r?w?0:p(v,E):w?p(v+(v<0?I:-I),E):0;if(!f&&(d=c=w)&&a.lineStart(),w!==c&&(g=m(f,R),(!g||Nt(f,g)||Nt(R,g))&&(R[2]=1)),w!==c)M=0,w?(a.lineStart(),g=m(R,f),a.point(g[0],g[1])):(g=m(f,R),a.point(g[0],g[1],2),a.lineEnd()),f=g;else if(o&&f&&r^w){var N;!(A&s)&&(N=m(R,f,!0))&&(M=0,r?(a.lineStart(),a.point(N[0][0],N[0][1]),a.point(N[1][0],N[1][1]),a.lineEnd()):(a.point(N[1][0],N[1][1]),a.lineEnd(),a.lineStart(),a.point(N[0][0],N[0][1],3)))}w&&(!f||!Nt(f,R))&&a.point(R[0],R[1]),f=R,c=w,s=A},lineEnd:function(){c&&a.lineEnd(),f=null},clean:function(){return M|(d&&c)<<1}}}function m(a,f,s){var c=it(a),d=it(f),M=[1,0,0],v=mt(c,d),E=kt(v,v),R=v[0],g=E-R*R;if(!g)return!s&&a;var w=n*E/g,A=-n*R/g,N=mt(M,v),T=Bt(M,w),_=Bt(v,A);on(T,_);var G=N,k=kt(T,G),C=kt(G,G),b=k*k-C*(kt(T,T)-1);if(!(b<0)){var O=X(b),$=Bt(G,(-k-O)/C);if(on($,T),$=St($),!s)return $;var h=a[0],L=f[0],H=a[1],tt=f[1],ot;L<h&&(ot=h,h=L,L=ot);var Tt=L-h,ct=q(Tt-I)<P,Et=ct||Tt<P;if(!ct&&tt<H&&(ot=H,H=tt,tt=ot),Et?ct?H+tt>0^$[1]<(q($[0]-h)<P?H:tt):H<=$[1]&&$[1]<=tt:Tt>I^(h<=$[0]&&$[0]<=L)){var pt=Bt(G,(-k+O)/C);return on(pt,T),[$,St(pt)]}}}function p(a,f){var s=r?t:I-t,c=0;return a<-s?c|=1:a>s&&(c|=2),f<-s?c|=4:f>s&&(c|=8),c}return vn(u,l,i,r?[0,-t]:[-I,t-I])}function Jr(t,n,e,r,o,i){var u=t[0],l=t[1],m=n[0],p=n[1],a=0,f=1,s=m-u,c=p-l,d;if(d=e-u,!(!s&&d>0)){if(d/=s,s<0){if(d<a)return;d<f&&(f=d)}else if(s>0){if(d>f)return;d>a&&(a=d)}if(d=o-u,!(!s&&d<0)){if(d/=s,s<0){if(d>f)return;d>a&&(a=d)}else if(s>0){if(d<a)return;d<f&&(f=d)}if(d=r-l,!(!c&&d>0)){if(d/=c,c<0){if(d<a)return;d<f&&(f=d)}else if(c>0){if(d>f)return;d>a&&(a=d)}if(d=i-l,!(!c&&d<0)){if(d/=c,c<0){if(d>f)return;d>a&&(a=d)}else if(c>0){if(d<a)return;d<f&&(f=d)}return a>0&&(t[0]=u+a*s,t[1]=l+a*c),f<1&&(n[0]=u+f*s,n[1]=l+f*c),!0}}}}}var Wt=1e9,xn=-Wt;function Wn(t,n,e,r){function o(p,a){return t<=p&&p<=e&&n<=a&&a<=r}function i(p,a,f,s){var c=0,d=0;if(p==null||(c=u(p,f))!==(d=u(a,f))||m(p,a)<0^f>0)do s.point(c===0||c===3?t:e,c>1?r:n);while((c=(c+f+4)%4)!==d);else s.point(a[0],a[1])}function u(p,a){return q(p[0]-t)<P?a>0?0:3:q(p[0]-e)<P?a>0?2:1:q(p[1]-n)<P?a>0?1:0:a>0?3:2}function l(p,a){return m(p.x,a.x)}function m(p,a){var f=u(p,1),s=u(a,1);return f!==s?f-s:f===0?a[1]-p[1]:f===1?p[0]-a[0]:f===2?p[1]-a[1]:a[0]-p[0]}return function(p){var a=p,f=dn(),s,c,d,M,v,E,R,g,w,A,N,T={point:_,lineStart:b,lineEnd:O,polygonStart:k,polygonEnd:C};function _(h,L){o(h,L)&&a.point(h,L)}function G(){for(var h=0,L=0,H=c.length;L<H;++L)for(var tt=c[L],ot=1,Tt=tt.length,ct=tt[0],Et,pt,tn=ct[0],Rt=ct[1];ot<Tt;++ot)Et=tn,pt=Rt,ct=tt[ot],tn=ct[0],Rt=ct[1],pt<=r?Rt>r&&(tn-Et)*(r-pt)>(Rt-pt)*(t-Et)&&++h:Rt<=r&&(tn-Et)*(r-pt)<(Rt-pt)*(t-Et)&&--h;return h}function k(){a=f,s=[],c=[],N=!0}function C(){var h=G(),L=N&&h,H=(s=At(s)).length;(L||H)&&(p.polygonStart(),L&&(p.lineStart(),i(null,null,1,p),p.lineEnd()),H&&hn(s,l,h,i,p),p.polygonEnd()),a=p,s=c=d=null}function b(){T.point=$,c&&c.push(d=[]),A=!0,w=!1,R=g=NaN}function O(){s&&($(M,v),E&&w&&f.rejoin(),s.push(f.result())),T.point=_,w&&a.lineEnd()}function $(h,L){var H=o(h,L);if(c&&d.push([h,L]),A)M=h,v=L,E=H,A=!1,H&&(a.lineStart(),a.point(h,L));else if(H&&w)a.point(h,L);else{var tt=[R=Math.max(xn,Math.min(Wt,R)),g=Math.max(xn,Math.min(Wt,g))],ot=[h=Math.max(xn,Math.min(Wt,h)),L=Math.max(xn,Math.min(Wt,L))];Jr(tt,ot,t,n,e,r)?(w||(a.lineStart(),a.point(tt[0],tt[1])),a.point(ot[0],ot[1]),H||a.lineEnd(),N=!1):H&&(a.lineStart(),a.point(h,L),N=!1)}R=h,g=L,w=H}return T}}var Hn,jn,En,yn,It={sphere:z,point:z,lineStart:to,lineEnd:z,polygonStart:z,polygonEnd:z};function to(){It.point=ro,It.lineEnd=no}function no(){It.point=It.lineEnd=z}function ro(t,n){t*=y,n*=y,jn=t,En=x(n),yn=S(n),It.point=eo}function eo(t,n){t*=y,n*=y;var e=x(n),r=S(n),o=q(t-jn),i=S(o),u=x(o),l=r*u,m=yn*e-En*r*i,p=En*e+yn*r*i;Hn.add(Z(X(l*l+m*m),p)),jn=t,En=e,yn=r}function Kr(t){return Hn=new D,U(t,It),+Hn}var Un=[null,null],oo={type:"LineString",coordinates:Un};function Lt(t,n){return Un[0]=t,Un[1]=n,Kr(oo)}var Qr={Feature:function(t,n){return Sn(t.geometry,n)},FeatureCollection:function(t,n){for(var e=t.features,r=-1,o=e.length;++r<o;)if(Sn(e[r].geometry,n))return!0;return!1}},Vr={Sphere:function(){return!0},Point:function(t,n){return br(t.coordinates,n)},MultiPoint:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)if(br(e[r],n))return!0;return!1},LineString:function(t,n){return te(t.coordinates,n)},MultiLineString:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)if(te(e[r],n))return!0;return!1},Polygon:function(t,n){return ne(t.coordinates,n)},MultiPolygon:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)if(ne(e[r],n))return!0;return!1},GeometryCollection:function(t,n){for(var e=t.geometries,r=-1,o=e.length;++r<o;)if(Sn(e[r],n))return!0;return!1}};function Sn(t,n){return t&&Vr.hasOwnProperty(t.type)?Vr[t.type](t,n):!1}function br(t,n){return Lt(t,n)===0}function te(t,n){for(var e,r,o,i=0,u=t.length;i<u;i++){if(r=Lt(t[i],n),r===0||i>0&&(o=Lt(t[i],t[i-1]),o>0&&e<=o&&r<=o&&(e+r-o)*(1-Math.pow((e-r)/o,2))<yt*o))return!0;e=r}return!1}function ne(t,n){return!!gn(t.map(io),re(n))}function io(t){return t=t.map(re),t.pop(),t}function re(t){return[t[0]*y,t[1]*y]}function ee(t,n){return(t&&Qr.hasOwnProperty(t.type)?Qr[t.type]:Sn)(t,n)}function oe(t,n,e){var r=dt(t,n-P,e).concat(n);return function(o){return r.map(function(i){return[o,i]})}}function ie(t,n,e){var r=dt(t,n-P,e).concat(n);return function(o){return r.map(function(i){return[i,o]})}}function Jn(){var t,n,e,r,o,i,u,l,m=10,p=m,a=90,f=360,s,c,d,M,v=2.5;function E(){return{type:"MultiLineString",coordinates:R()}}function R(){return dt($t(r/a)*a,e,a).map(d).concat(dt($t(l/f)*f,u,f).map(M)).concat(dt($t(n/m)*m,t,m).filter(function(g){return q(g%a)>P}).map(s)).concat(dt($t(i/p)*p,o,p).filter(function(g){return q(g%f)>P}).map(c))}return E.lines=function(){return R().map(function(g){return{type:"LineString",coordinates:g}})},E.outline=function(){return{type:"Polygon",coordinates:[d(r).concat(M(u).slice(1),d(e).reverse().slice(1),M(l).reverse().slice(1))]}},E.extent=function(g){return arguments.length?E.extentMajor(g).extentMinor(g):E.extentMinor()},E.extentMajor=function(g){return arguments.length?(r=+g[0][0],e=+g[1][0],l=+g[0][1],u=+g[1][1],r>e&&(g=r,r=e,e=g),l>u&&(g=l,l=u,u=g),E.precision(v)):[[r,l],[e,u]]},E.extentMinor=function(g){return arguments.length?(n=+g[0][0],t=+g[1][0],i=+g[0][1],o=+g[1][1],n>t&&(g=n,n=t,t=g),i>o&&(g=i,i=o,o=g),E.precision(v)):[[n,i],[t,o]]},E.step=function(g){return arguments.length?E.stepMajor(g).stepMinor(g):E.stepMinor()},E.stepMajor=function(g){return arguments.length?(a=+g[0],f=+g[1],E):[a,f]},E.stepMinor=function(g){return arguments.length?(m=+g[0],p=+g[1],E):[m,p]},E.precision=function(g){return arguments.length?(v=+g,s=oe(i,o,90),c=ie(n,t,v),d=oe(l,u,90),M=ie(r,e,v),E):v},E.extentMajor([[-180,-90+P],[180,90-P]]).extentMinor([[-180,-80-P],[180,80+P]])}function ae(){return Jn()()}function fe(t,n){var e=t[0]*y,r=t[1]*y,o=n[0]*y,i=n[1]*y,u=S(r),l=x(r),m=S(i),p=x(i),a=u*S(e),f=u*x(e),s=m*S(o),c=m*x(o),d=2*j(X(Ln(i-r)+u*m*Ln(o-e))),M=x(d),v=d?function(E){var R=x(E*=d)/M,g=x(d-E)/M,w=g*a+R*s,A=g*f+R*c,N=g*l+R*p;return[Z(A,w)*F,Z(N,X(w*w+A*A))*F]}:function(){return[e*F,r*F]};return v.distance=d,v}var Ht=t=>t;var Kn=new D,Qn=new D,ue,le,Vn,bn,xt={point:z,lineStart:z,lineEnd:z,polygonStart:function(){xt.lineStart=ao,xt.lineEnd=uo},polygonEnd:function(){xt.lineStart=xt.lineEnd=xt.point=z,Kn.add(q(Qn)),Qn=new D},result:function(){var t=Kn/2;return Kn=new D,t}};function ao(){xt.point=fo}function fo(t,n){xt.point=se,ue=Vn=t,le=bn=n}function se(t,n){Qn.add(bn*t-Vn*n),Vn=t,bn=n}function uo(){se(ue,le)}var tr=xt;var zt=1/0,wn=zt,jt=-zt,Pn=jt,lo={point:so,lineStart:z,lineEnd:z,polygonStart:z,polygonEnd:z,result:function(){var t=[[zt,wn],[jt,Pn]];return jt=Pn=-(wn=zt=1/0),t}};function so(t,n){t<zt&&(zt=t),t>jt&&(jt=t),n<wn&&(wn=n),n>Pn&&(Pn=n)}var _t=lo;var nr=0,rr=0,Ut=0,Mn=0,Rn=0,Gt=0,er=0,or=0,Jt=0,de,me,lt,st,ut={point:Mt,lineStart:ce,lineEnd:pe,polygonStart:function(){ut.lineStart=mo,ut.lineEnd=ho},polygonEnd:function(){ut.point=Mt,ut.lineStart=ce,ut.lineEnd=pe},result:function(){var t=Jt?[er/Jt,or/Jt]:Gt?[Mn/Gt,Rn/Gt]:Ut?[nr/Ut,rr/Ut]:[NaN,NaN];return nr=rr=Ut=Mn=Rn=Gt=er=or=Jt=0,t}};function Mt(t,n){nr+=t,rr+=n,++Ut}function ce(){ut.point=co}function co(t,n){ut.point=po,Mt(lt=t,st=n)}function po(t,n){var e=t-lt,r=n-st,o=X(e*e+r*r);Mn+=o*(lt+t)/2,Rn+=o*(st+n)/2,Gt+=o,Mt(lt=t,st=n)}function pe(){ut.point=Mt}function mo(){ut.point=go}function ho(){he(de,me)}function go(t,n){ut.point=he,Mt(de=lt=t,me=st=n)}function he(t,n){var e=t-lt,r=n-st,o=X(e*e+r*r);Mn+=o*(lt+t)/2,Rn+=o*(st+n)/2,Gt+=o,o=st*t-lt*n,er+=o*(lt+t),or+=o*(st+n),Jt+=o*3,Mt(lt=t,st=n)}var ir=ut;function An(t){this._context=t}An.prototype={_radius:4.5,pointRadius:function(t){return this._radius=t,this},polygonStart:function(){this._line=0},polygonEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){this._line===0&&this._context.closePath(),this._point=NaN},point:function(t,n){switch(this._point){case 0:{this._context.moveTo(t,n),this._point=1;break}case 1:{this._context.lineTo(t,n);break}default:{this._context.moveTo(t+this._radius,n),this._context.arc(t,n,this._radius,0,W);break}}},result:z};var fr=new D,ar,ge,ve,Kt,Qt,Cn={point:z,lineStart:function(){Cn.point=vo},lineEnd:function(){ar&&xe(ge,ve),Cn.point=z},polygonStart:function(){ar=!0},polygonEnd:function(){ar=null},result:function(){var t=+fr;return fr=new D,t}};function vo(t,n){Cn.point=xe,ge=Kt=t,ve=Qt=n}function xe(t,n){Kt-=t,Qt-=n,fr.add(X(Kt*Kt+Qt*Qt)),Kt=t,Qt=n}var ur=Cn;var Ee,qn,ye,Se,Ft=class{constructor(n){this._append=n==null?we:xo(n),this._radius=4.5,this._=""}pointRadius(n){return this._radius=+n,this}polygonStart(){this._line=0}polygonEnd(){this._line=NaN}lineStart(){this._point=0}lineEnd(){this._line===0&&(this._+="Z"),this._point=NaN}point(n,e){switch(this._point){case 0:{this._append`M${n},${e}`,this._point=1;break}case 1:{this._append`L${n},${e}`;break}default:{if(this._append`M${n},${e}`,this._radius!==ye||this._append!==qn){let r=this._radius,o=this._;this._="",this._append`m0,${r}a${r},${r} 0 1,1 0,${-2*r}a${r},${r} 0 1,1 0,${2*r}z`,ye=r,qn=this._append,Se=this._,this._=o}this._+=Se;break}}}result(){let n=this._;return this._="",n.length?n:null}};function we(t){let n=1;this._+=t[0];for(let e=t.length;n<e;++n)this._+=arguments[n]+t[n]}function xo(t){let n=Math.floor(t);if(!(n>=0))throw new RangeError(`invalid digits: ${t}`);if(n>15)return we;if(n!==Ee){let e=10**n;Ee=n,qn=function(o){let i=1;this._+=o[0];for(let u=o.length;i<u;++i)this._+=Math.round(arguments[i]*e)/e+o[i]}}return qn}function Pe(t,n){let e=3,r=4.5,o,i;function u(l){return l&&(typeof r=="function"&&i.pointRadius(+r.apply(this,arguments)),U(l,o(i))),i.result()}return u.area=function(l){return U(l,o(tr)),tr.result()},u.measure=function(l){return U(l,o(ur)),ur.result()},u.bounds=function(l){return U(l,o(_t)),_t.result()},u.centroid=function(l){return U(l,o(ir)),ir.result()},u.projection=function(l){return arguments.length?(o=l==null?(t=null,Ht):(t=l).stream,u):t},u.context=function(l){return arguments.length?(i=l==null?(n=null,new Ft(e)):new An(n=l),typeof r!="function"&&i.pointRadius(r),u):n},u.pointRadius=function(l){return arguments.length?(r=typeof l=="function"?l:(i.pointRadius(+l),+l),u):r},u.digits=function(l){if(!arguments.length)return e;if(l==null)e=null;else{let m=Math.floor(l);if(!(m>=0))throw new RangeError(`invalid digits: ${l}`);e=m}return n===null&&(i=new Ft(e)),u},u.projection(t).digits(e).context(n)}function Vt(t){return function(n){var e=new lr;for(var r in t)e[r]=t[r];return e.stream=n,e}}function lr(){}lr.prototype={constructor:lr,point:function(t,n){this.stream.point(t,n)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}};function sr(t,n,e){var r=t.clipExtent&&t.clipExtent();return t.scale(150).translate([0,0]),r!=null&&t.clipExtent(null),U(e,t.stream(_t)),n(_t.result()),r!=null&&t.clipExtent(r),t}function cr(t,n,e){return sr(t,function(r){var o=n[1][0]-n[0][0],i=n[1][1]-n[0][1],u=Math.min(o/(r[1][0]-r[0][0]),i/(r[1][1]-r[0][1])),l=+n[0][0]+(o-u*(r[1][0]+r[0][0]))/2,m=+n[0][1]+(i-u*(r[1][1]+r[0][1]))/2;t.scale(150*u).translate([l,m])},e)}function Me(t,n,e){return cr(t,[[0,0],n],e)}function Re(t,n,e){return sr(t,function(r){var o=+n,i=o/(r[1][0]-r[0][0]),u=(o-i*(r[1][0]+r[0][0]))/2,l=-i*r[0][1];t.scale(150*i).translate([u,l])},e)}function Ae(t,n,e){return sr(t,function(r){var o=+n,i=o/(r[1][1]-r[0][1]),u=-i*r[0][0],l=(o-i*(r[1][1]+r[0][1]))/2;t.scale(150*i).translate([u,l])},e)}var Ce=16,Eo=S(30*y);function pr(t,n){return+n?So(t,n):yo(t)}function yo(t){return Vt({point:function(n,e){n=t(n,e),this.stream.point(n[0],n[1])}})}function So(t,n){function e(r,o,i,u,l,m,p,a,f,s,c,d,M,v){var E=p-r,R=a-o,g=E*E+R*R;if(g>4*n&&M--){var w=u+s,A=l+c,N=m+d,T=X(w*w+A*A+N*N),_=j(N/=T),G=q(q(N)-1)<P||q(i-f)<P?(i+f)/2:Z(A,w),k=t(G,_),C=k[0],b=k[1],O=C-r,$=b-o,h=R*O-E*$;(h*h/g>n||q((E*O+R*$)/g-.5)>.3||u*s+l*c+m*d<Eo)&&(e(r,o,i,u,l,m,C,b,G,w/=T,A/=T,N,M,v),v.point(C,b),e(C,b,G,w,A,N,p,a,f,s,c,d,M,v))}}return function(r){var o,i,u,l,m,p,a,f,s,c,d,M,v={point:E,lineStart:R,lineEnd:w,polygonStart:function(){r.polygonStart(),v.lineStart=A},polygonEnd:function(){r.polygonEnd(),v.lineStart=R}};function E(_,G){_=t(_,G),r.point(_[0],_[1])}function R(){f=NaN,v.point=g,r.lineStart()}function g(_,G){var k=it([_,G]),C=t(_,G);e(f,s,a,c,d,M,f=C[0],s=C[1],a=_,c=k[0],d=k[1],M=k[2],Ce,r),r.point(f,s)}function w(){v.point=E,r.lineEnd()}function A(){R(),v.point=N,v.lineEnd=T}function N(_,G){g(o=_,G),i=f,u=s,l=c,m=d,p=M,v.point=g}function T(){e(f,s,a,c,d,M,i,u,o,l,m,p,Ce,r),v.lineEnd=w,w()}return v}}var wo=Vt({point:function(t,n){this.stream.point(t*y,n*y)}});function Po(t){return Vt({point:function(n,e){var r=t(n,e);return this.stream.point(r[0],r[1])}})}function Mo(t,n,e,r,o){function i(u,l){return u*=r,l*=o,[n+t*u,e-t*l]}return i.invert=function(u,l){return[(u-n)/t*r,(e-l)/t*o]},i}function qe(t,n,e,r,o,i){if(!i)return Mo(t,n,e,r,o);var u=S(i),l=x(i),m=u*t,p=l*t,a=u/t,f=l/t,s=(l*e-u*n)/t,c=(l*n+u*e)/t;function d(M,v){return M*=r,v*=o,[m*M-p*v+n,e-p*M-m*v]}return d.invert=function(M,v){return[r*(a*M-f*v+s),o*(c-f*M-a*v)]},d}function bt(t){return Ro(function(){return t})()}function Ro(t){var n,e=150,r=480,o=250,i=0,u=0,l=0,m=0,p=0,a,f=0,s=1,c=1,d=null,M=Zn,v=null,E,R,g,w=Ht,A=.5,N,T,_,G,k;function C(h){return _(h[0]*y,h[1]*y)}function b(h){return h=_.invert(h[0],h[1]),h&&[h[0]*F,h[1]*F]}C.stream=function(h){return G&&k===h?G:G=wo(Po(a)(M(N(w(k=h)))))},C.preclip=function(h){return arguments.length?(M=h,d=void 0,$()):M},C.postclip=function(h){return arguments.length?(w=h,v=E=R=g=null,$()):w},C.clipAngle=function(h){return arguments.length?(M=+h?Ur(d=h*y):(d=null,Zn),$()):d*F},C.clipExtent=function(h){return arguments.length?(w=h==null?(v=E=R=g=null,Ht):Wn(v=+h[0][0],E=+h[0][1],R=+h[1][0],g=+h[1][1]),$()):v==null?null:[[v,E],[R,g]]},C.scale=function(h){return arguments.length?(e=+h,O()):e},C.translate=function(h){return arguments.length?(r=+h[0],o=+h[1],O()):[r,o]},C.center=function(h){return arguments.length?(i=h[0]%360*y,u=h[1]%360*y,O()):[i*F,u*F]},C.rotate=function(h){return arguments.length?(l=h[0]%360*y,m=h[1]%360*y,p=h.length>2?h[2]%360*y:0,O()):[l*F,m*F,p*F]},C.angle=function(h){return arguments.length?(f=h%360*y,O()):f*F},C.reflectX=function(h){return arguments.length?(s=h?-1:1,O()):s<0},C.reflectY=function(h){return arguments.length?(c=h?-1:1,O()):c<0},C.precision=function(h){return arguments.length?(N=pr(T,A=h*h),$()):X(A)},C.fitExtent=function(h,L){return cr(C,h,L)},C.fitSize=function(h,L){return Me(C,h,L)},C.fitWidth=function(h,L){return Re(C,h,L)},C.fitHeight=function(h,L){return Ae(C,h,L)};function O(){var h=qe(e,0,0,s,c,f).apply(null,n(i,u)),L=qe(e,r-h[0],o-h[1],s,c,f);return a=Yn(l,m,p),T=Zt(n,L),_=Zt(a,T),N=pr(T,A),$()}function $(){return G=k=null,C}return function(){return n=t.apply(this,arguments),C.invert=n.invert&&b,O()}}function Ne(t){return function(n,e){var r=X(n*n+e*e),o=t(r),i=x(o),u=S(o);return[Z(n*i,r*u),j(r&&e*i/r)]}}function dr(t,n){var e=n*n,r=e*e;return[t*(.8707-.131979*e+r*(-.013791+r*(.003971*e-.001529*r))),n*(1.007226+e*(.015085+r*(-.044475+.028874*e-.005916*r)))]}dr.invert=function(t,n){var e=n,r=25,o;do{var i=e*e,u=i*i;e-=o=(e*(1.007226+i*(.015085+u*(-.044475+.028874*i-.005916*u)))-n)/(1.007226+i*(.015085*3+u*(-.044475*7+.028874*9*i-.005916*11*u)))}while(q(o)>P&&--r>0);return[t/(.8707+(i=e*e)*(-.131979+i*(-.013791+i*i*i*(.003971-.001529*i)))),e]};function Ie(){return bt(dr).scale(175.295)}function mr(t,n){return[S(n)*x(t),x(n)]}mr.invert=Ne(j);function Le(){return bt(mr).scale(249.5).clipAngle(90+P)}function hr(t){return t}function Nn(t){if(t==null)return hr;var n,e,r=t.scale[0],o=t.scale[1],i=t.translate[0],u=t.translate[1];return function(l,m){m||(n=e=0);var p=2,a=l.length,f=new Array(a);for(f[0]=(n+=l[0])*r+i,f[1]=(e+=l[1])*o+u;p<a;)f[p]=l[p],++p;return f}}function ze(t,n){for(var e,r=t.length,o=r-n;o<--r;)e=t[o],t[o++]=t[r],t[r]=e}function Ge(t,n){return typeof n=="string"&&(n=t.objects[n]),n.type==="GeometryCollection"?{type:"FeatureCollection",features:n.geometries.map(function(e){return _e(t,e)})}:_e(t,n)}function _e(t,n){var e=n.id,r=n.bbox,o=n.properties==null?{}:n.properties,i=In(t,n);return e==null&&r==null?{type:"Feature",properties:o,geometry:i}:r==null?{type:"Feature",id:e,properties:o,geometry:i}:{type:"Feature",id:e,bbox:r,properties:o,geometry:i}}function In(t,n){var e=Nn(t.transform),r=t.arcs;function o(a,f){f.length&&f.pop();for(var s=r[a<0?~a:a],c=0,d=s.length;c<d;++c)f.push(e(s[c],c));a<0&&ze(f,d)}function i(a){return e(a)}function u(a){for(var f=[],s=0,c=a.length;s<c;++s)o(a[s],f);return f.length<2&&f.push(f[0]),f}function l(a){for(var f=u(a);f.length<4;)f.push(f[0]);return f}function m(a){return a.map(l)}function p(a){var f=a.type,s;switch(f){case"GeometryCollection":return{type:f,geometries:a.geometries.map(p)};case"Point":s=i(a.coordinates);break;case"MultiPoint":s=a.coordinates.map(i);break;case"LineString":s=u(a.arcs);break;case"MultiLineString":s=a.arcs.map(u);break;case"Polygon":s=m(a.arcs);break;case"MultiPolygon":s=a.arcs.map(m);break;default:return null}return{type:f,coordinates:s}}return p(n)}function gr(t,n){var e={},r={},o={},i=[],u=-1;n.forEach(function(p,a){var f=t.arcs[p<0?~p:p],s;f.length<3&&!f[1][0]&&!f[1][1]&&(s=n[++u],n[u]=p,n[a]=s)}),n.forEach(function(p){var a=l(p),f=a[0],s=a[1],c,d;if(c=o[f])if(delete o[c.end],c.push(p),c.end=s,d=r[s]){delete r[d.start];var M=d===c?c:c.concat(d);r[M.start=c.start]=o[M.end=d.end]=M}else r[c.start]=o[c.end]=c;else if(c=r[s])if(delete r[c.start],c.unshift(p),c.start=f,d=o[f]){delete o[d.end];var v=d===c?c:d.concat(c);r[v.start=d.start]=o[v.end=c.end]=v}else r[c.start]=o[c.end]=c;else c=[p],r[c.start=f]=o[c.end=s]=c});function l(p){var a=t.arcs[p<0?~p:p],f=a[0],s;return t.transform?(s=[0,0],a.forEach(function(c){s[0]+=c[0],s[1]+=c[1]})):s=a[a.length-1],p<0?[s,f]:[f,s]}function m(p,a){for(var f in p){var s=p[f];delete a[s.start],delete s.start,delete s.end,s.forEach(function(c){e[c<0?~c:c]=1}),i.push(s)}}return m(o,r),m(r,o),n.forEach(function(p){e[p<0?~p:p]||i.push([p])}),i}function Fe(t){return In(t,Te.apply(this,arguments))}function Te(t,n,e){var r,o,i;if(arguments.length>1)r=Ao(t,n,e);else for(o=0,r=new Array(i=t.arcs.length);o<i;++o)r[o]=o;return{type:"MultiLineString",arcs:gr(t,r)}}function Ao(t,n,e){var r=[],o=[],i;function u(f){var s=f<0?~f:f;(o[s]||(o[s]=[])).push({i:f,g:i})}function l(f){f.forEach(u)}function m(f){f.forEach(l)}function p(f){f.forEach(m)}function a(f){switch(i=f,f.type){case"GeometryCollection":f.geometries.forEach(a);break;case"LineString":l(f.arcs);break;case"MultiLineString":case"Polygon":m(f.arcs);break;case"MultiPolygon":p(f.arcs);break}}return a(n),o.forEach(e==null?function(f){r.push(f[0].i)}:function(f){e(f[0].g,f[f.length-1].g)&&r.push(f[0].i)}),r}
return { feature: Ge, geoArea: Ar, geoBounds: Gr, geoCentroid: Br, geoContains: ee, geoDistance: Lt, geoGraticule10: ae, geoInterpolate: fe, geoNaturalEarth1: Ie, geoOrthographic: Le, geoPath: Pe, geoRotation: Zr, mesh: Fe };
})();
const { feature, geoArea, geoBounds, geoCentroid, geoContains, geoDistance, geoGraticule10, geoInterpolate, geoNaturalEarth1, geoOrthographic, geoPath, geoRotation, mesh } = __GEO;

const __TEXT = (function(){
// Every word World Capitals, World Countries and World Flags show, and the language they show it in.
//
// EN below is the English text. A key with a subject in front ('capitals.sub') is that tool's own wording and
// wins over the plain key. Other languages come from lang/<code>.json (built by tools-src/capital-atlas/lang.mjs):
// country, capital, place and water names for all of them, and the interface (ui) for the ones it has been
// translated into. A key a language lacks falls back to English. No page code here.
//
// {name} in a text is filled in; a text can also be { one: '…', other: '…' } (or few / many), picked by the number n.

const EN = {
	/* ---------- the page ---------- */
	map_aria: 'Map of the world. Drag to move, scroll or pinch to zoom, click a country to select it.',
	home_aria: 'SampleSize_1 home page',
	'capitals.sub': 'Learn the capital of every country',
	'countries.sub': 'Find every country on the map',
	'flags.sub': 'Learn the flag of every country',
	loading: 'Loading',
	world_map: 'World map',
	answer_aria: 'Your answer',
	enter: 'Enter',
	r_misspelled: 'misspelled (½ point)',
	r_hint: 'Click any country to see how it went.',
	r_again: 'Go again',
	r_practice: 'Practise the misses',
	stat_acc: 'Accuracy',
	stat_time: 'Time',
	stat_streak: 'Streak',
	rail_aria: 'Regions',
	rail_title: 'Study one region at a time',
	view: 'View',
	names: 'Names',
	names_title: 'Names of oceans, seas, lakes and rivers on the map (L)',
	names_on: 'Water names on.',
	names_off: 'Water names off.',
	done: 'Done',
	globe: 'Globe',
	globe_title: '3D globe (G switches)',
	flat: 'Flat map',
	flat_title: 'Flat map (G switches)',
	zoom_to: 'Zoom to',
	zoom_out: 'Zoom −',
	zoom_out_title: 'Zoom out (−)',
	zoom_in: 'Zoom +',
	zoom_in_title: 'Zoom in (+)',
	reset: 'Reset view',
	reset_title: 'Back to the region you’re studying (Esc)',
	view_hint_narrow: 'Zoom only moves the map; the quiz carries on. Pinch to zoom, drag to move.',
	settings: 'Settings',
	lang_title: 'Language',
	// a language with names but no translated interface (shown in English, so {lang} is in its own name)
	lang_note: 'Names in {lang}. The rest of the page stays in English.',
	mode: 'Mode',
	mode_study: 'Study',
	mode_practice: 'Practice',
	mode_test: 'Test',
	questions: 'Questions',
	'capitals.fmt_click': 'Click the capital',
	'capitals.fmt_type': 'Type the capital',
	'countries.fmt_click': 'Click the country',
	'countries.fmt_type': 'Type the name',
	'flags.fmt_click': 'Click the country',
	'flags.fmt_type': 'Type the country',
	difficulty: 'Difficulty',
	easy: 'Easy',
	hard: 'Hard',
	find: 'Find a country',
	search_ph: 'Country or capital, e.g. Peru, Oslo',
	restart: 'Restart',
	clean: 'Clean view',
	// the credit line: {ne}, {cf} and {fi} are its links (Natural Earth, country-flags, flag-icons)
	'capitals.credit': 'Map: {ne} (public domain). Capitals checked October 2026. Made by @samplesize_1.',
	'countries.credit': 'Map: {ne} (public domain). The 197 countries of World Capitals. Made by @samplesize_1.',
	'flags.credit': 'Map: {ne} (public domain). Flags: {cf}, from Wikimedia Commons (public domain); Syria’s and Kyrgyzstan’s current flags from {fi} (MIT). Checked November 2026. Made by @samplesize_1.',
	// added to the credit in any other language
	names_credit: 'Names in other languages: Unicode CLDR (countries) and Natural Earth, from Wikidata (capitals, seas, lakes and rivers).',
	prev: 'Previous',
	next: 'Next',
	back: 'Back',
	skip: 'Skip',
	show_me: 'Show me',
	give_up: 'Give up',
	clean_exit: 'Exit clean view',
	confirm_title: 'End this test?',
	end_test: 'End test',
	keep_going: 'Keep going',
	load_msg: 'Loading the world map…',
	load_fail: 'The world map didn’t load. Check your connection and reload the page.',

	/* ---------- regions ---------- */
	'region.world': 'World',
	'region.europe': 'Europe',
	'region.asia': 'Asia',
	'region.north-america': 'North America',
	'region.south-america': 'South America',
	'region.africa': 'Africa',
	'region.oceania': 'Oceania',
	'region.north-central-america': 'North & Central America',
	'region.caribbean': 'Caribbean',
	'region.northern-europe': 'Northern Europe',
	'region.western-europe': 'Western Europe',
	'region.southern-europe': 'Southern Europe',
	'region.eastern-europe': 'Eastern Europe',
	'region.east-asia': 'East Asia',
	'region.southeast-asia': 'Southeast Asia',
	'region.south-central-asia': 'South & Central Asia',
	'region.middle-east': 'Middle East',
	'region.north-africa': 'North Africa',
	'region.west-africa': 'West Africa',
	'region.east-africa': 'East Africa',
	'region.southern-africa': 'Southern Africa',
	'region.australia-melanesia': 'Australia & Melanesia',
	'region.micronesia-polynesia': 'Micronesia & Polynesia',
	'region.pacific': 'Pacific islands',

	/* ---------- the prompt and the quiz ---------- */
	nothing_to_study: 'Nothing to study here',
	pick_country: 'Pick a country',
	study_meta_all: { one: '{n} country · click it, or → to carry on', other: '{n} countries · click one, or ← → to carry on' },
	study_meta: '{i} of {n} · ← → to move, or click any country',
	no_countries: 'No countries in this selection',
	test_complete: 'Test complete',
	set_learned: 'Set learned',
	test_finished: 'Test finished',
	review_meta: '{acc}% accuracy · {time} · best {best}/{total}',
	n_of_n: '{a} of {n}',
	meta_answered: '{region} · {a}/{n} answered',
	meta_learned: '{region} · {a}/{n} learned',
	last_one: 'This is the last one left.',
	outside: 'That’s {name}, outside {region}.',
	not_that_glow: 'Not that one. Click the glowing country.',
	that_glow: 'That’s {name}. Click the glowing country.',
	not_that: 'Not that one.',
	type_to_go_on: 'Type “{answer}” to carry on.',
	correct_that: 'Correct, that’s {name}.',
	it_was: 'It was {name}.',
	r_correct: 'correct',
	r_first: 'first try',
	r_gave_up: 'gave up',
	r_missed: 'missed',
	r_needed_help: 'needed help',
	type_x: 'Type {answer}',
	flag_to_find: 'The flag to find',
	here_it_is: 'Here it is. Click the glowing country',
	type_it: 'Type it to carry on.',
	restarting: 'Restarting',
	switching_to: 'Switching to {region}',
	changing_mode: 'Changing mode',
	changing_format: 'Changing the question type',
	changing_level: 'Changing the difficulty',
	leaving: 'Leaving this page',
	// {what} is one of the six above
	confirm_msg: 'You’ve answered {a} of {n} ({region}). {what} ends this test, and it won’t count toward your best score.',
	hint_practice: 'Misses come back until you get them right. Countries you’ve missed before come up first.',
	hint_test: 'Every country in the region once, timed. Your best score is saved for each region.',
	hint_click_easy: 'Countries you’ve answered stay green or red, and a wrong click tells you which country it was.',
	hint_click_hard: 'Clicks flash green or red, but nothing stays coloured until the end and wrong clicks aren’t named: each question stands on its own.',
	hint_type_easy: 'Guess as often as you like, skip back and forth between countries (Enter with nothing typed skips), or give up to see the answer. A small misspelling turns the country yellow and counts as half a point.',
	// the keys: only the words between the <kbd> tags change
	keys: '<kbd>←</kbd><kbd>→</kbd> previous / next · <kbd>1</kbd>–<kbd>0</kbd> zoom · <kbd>+</kbd><kbd>−</kbd> zoom in / out · <kbd>Esc</kbd> deselect, then back to the region ·<kbd>G</kbd> globe / flat map · <kbd>V</kbd> voice · <kbd>L</kbd> water names · <kbd>C</kbd> clean view',
	// the same, where voice is English-only and so not offered
	keys_no_voice: '<kbd>←</kbd><kbd>→</kbd> previous / next · <kbd>1</kbd>–<kbd>0</kbd> zoom · <kbd>+</kbd><kbd>−</kbd> zoom in / out · <kbd>Esc</kbd> deselect, then back to the region ·<kbd>G</kbd> globe / flat map · <kbd>L</kbd> water names · <kbd>C</kbd> clean view',
	no_best: 'No saved result for this selection yet.',
	best_here: 'Best here: <b>{score}/{total}</b> in <b>{time}</b>',
	lake_is: 'That’s {name}.',
	a_lake: 'That’s a lake.',
	not_country: '{name} isn’t a country in this quiz.',
	place_of: '{name} ({of})',

	/* ---------- typed answers ---------- */
	try_again: 'Try again.',
	not_quite: 'Not quite. Try again, skip it, or give up.',
	close_note: 'Close: it’s spelled {answer}. Half a point.',
	so_close_hard: 'So close, but Hard needs the exact spelling: {answer}.',

	/* ---------- World Capitals ---------- */
	'capitals.study_hint': 'Step through each country with the arrows, or click any country to see its capital. No score.',
	'capitals.click_hint': 'You get a capital; click its country. Small countries have a ring you can click.',
	'capitals.type_hint': 'A country lights up; type its capital. Accents don’t matter. On Easy, a small spelling slip counts as half a point.',
	'capitals.type_hard_hint': 'One try per country, spelled right (accents and capitals don’t matter). Enter with nothing typed gives up.',
	'capitals.placeholder': 'Type the capital',
	'capitals.click_ask': 'Click the country whose capital is',
	'capitals.type_ask': 'What’s the capital of',
	'capitals.type_reveal': 'The capital of {name} is',
	'capitals.capital_of': '{capital} is the capital of {name}.',
	'capitals.former': '{typed} used to be the capital.',
	'capitals.other': '{capital} is the capital of {name}.',
	'capitals.tell': '{name}’s capital is {capital}.',
	'capitals.fact': '{name}: {capital}.',
	'capitals.pair': '{name}: {capital}',
	'capitals.outside': '{name}: {capital}. It’s outside {region}.',
	'capitals.miss_click': 'It was {name}.',

	/* ---------- World Countries ---------- */
	'countries.study_hint': 'Step through each country with the arrows, or click any country to see its name. No score.',
	'countries.click_hint': 'You get a country’s name; click it on the map. Small countries have a ring you can click.',
	'countries.type_hint': 'A country lights up; type its name. Accents don’t matter, and short names count (UK, Ivory Coast). On Easy, a small spelling slip counts as half a point.',
	'countries.type_hard_hint': 'One try per country, spelled right (accents and capital letters don’t matter). Enter with nothing typed gives up.',
	'countries.placeholder': 'Type the country',
	'countries.click_ask': 'Click the country',
	'countries.type_ask': 'Type the name of',
	'countries.the_glowing': 'the glowing country',
	'countries.type_reveal': 'The glowing country is',
	'countries.former': '{typed} is an old name.',
	'countries.other': '{name} is somewhere else.',
	'countries.tell': 'This is {name}.',
	'countries.fact': 'That’s {name}.',
	'countries.outside': 'That’s {name}, outside {region}.',
	'countries.miss_click': 'That’s {clicked}.',

	/* ---------- World Flags ---------- */
	'flags.study_hint': 'Step through each country with the arrows, or click any country to see its flag. No score.',
	'flags.click_hint': 'You get a flag; click its country. Small countries have a ring you can click.',
	'flags.type_hint': 'You get a flag; type the country’s name. Accents don’t matter, and short names count (UK, Ivory Coast). On Easy, a small spelling slip counts as half a point.',
	'flags.type_hard_hint': 'One try per flag, the country spelled right (accents and capital letters don’t matter). Enter with nothing typed gives up.',
	'flags.placeholder': 'Type the country',
	'flags.click_ask': 'Click the country with this flag',
	'flags.type_ask': 'Whose flag is this?',
	'flags.type_reveal': 'This is the flag of',
	'flags.former': '{typed} is an old name.',
	'flags.other': 'That’s not {name}’s flag.',
	'flags.tell': 'It’s the flag of {name}.',
	'flags.fact': 'That’s the flag of {name}.',
	'flags.outside': 'That’s {name}, outside {region}.',
	'flags.miss_click': 'That’s {clicked}. It was {name}.',
	// note.<id> (a capital's note, from countries.json) and flag.<id> (subjects.js) are added below
};

/* ---------------- the languages ---------------- */
// [code, its own name, html lang]: English, and the 25 languages Natural Earth names places in. Which of them have
// the interface translated is up to their lang/<code>.json. The page's start-up script (in index.html) lists the
// same codes; the unit tests hold the two together.
const LANGS = [
	['en', 'English', 'en'],
	['ar', 'العربية', 'ar'], ['bn', 'বাংলা', 'bn'], ['de', 'Deutsch', 'de'], ['el', 'Ελληνικά', 'el'], ['es', 'Español', 'es'],
	['fa', 'فارسی', 'fa'], ['fr', 'Français', 'fr'], ['he', 'עברית', 'he'], ['hi', 'हिन्दी', 'hi'], ['hu', 'Magyar', 'hu'],
	['id', 'Bahasa Indonesia', 'id'], ['it', 'Italiano', 'it'], ['ja', '日本語', 'ja'], ['ko', '한국어', 'ko'], ['nl', 'Nederlands', 'nl'],
	['pl', 'Polski', 'pl'], ['pt', 'Português', 'pt-BR'], ['ru', 'Русский', 'ru'], ['sv', 'Svenska', 'sv'], ['tr', 'Türkçe', 'tr'],
	['uk', 'Українська', 'uk'], ['ur', 'اردو', 'ur'], ['vi', 'Tiếng Việt', 'vi'], ['zh', '简体中文', 'zh-Hans'], ['zht', '繁體中文', 'zh-Hant'],
];

/* ---------------- the language in use ---------------- */
let LANG = 'en', SUBJECT = 'capitals';
let UI = {}; // the interface in this language ({} for English, or a language with names only)
let NAMES = { countries: {}, capitals: {}, places: {}, water: {}, langs: {} };
let PLURAL = new Intl.PluralRules('en');
const lang = () => LANG;
// its BCP 47 tag, for sorting and capital letters (zht -> zh-Hant)
const locale = () => (LANGS.find((l) => l[0] === LANG) || LANGS[0])[2];
const hasUi = () => LANG === 'en' || Object.keys(UI).length > 0;
function setSubject(key) {
	SUBJECT = key;
}
// data: a lang/<code>.json file (nothing for English)
function setLanguage(code, data) {
	LANG = code;
	UI = (data && data.ui) || {};
	NAMES = { countries: {}, capitals: {}, places: {}, water: {}, langs: {}, ...(data || {}) };
	try {
		PLURAL = new Intl.PluralRules(code === 'zht' ? 'zh-Hant' : code);
	} catch (e) {
		PLURAL = new Intl.PluralRules('en');
	}
}
// Text for a key, in the language in use, with {name}s filled in
function t(key, vars = {}) {
	const k2 = SUBJECT + '.' + key;
	let s = UI[k2] ?? UI[key] ?? EN[k2] ?? EN[key];
	if (s == null) return key;
	if (typeof s === 'object') s = s[PLURAL.select(Number(vars.n) || 0)] ?? s.other;
	return s.replace(/\{(\w+)\}/g, (m, v) => (v in vars ? vars[v] : m));
}
// A translated text that has no English key here (the notes: their English is in countries.json and
// subjects.js), or undefined
const uiText = (key) => UI[key];

/* ---------------- names ---------------- */
// a country's name and its capital, in the language in use (English where a source has no translation)
const nameOf = (c) => (NAMES.countries[c.id] && NAMES.countries[c.id][0]) || c.name;
const capitalOf = (c) => (NAMES.capitals[c.id] && NAMES.capitals[c.id][0]) || c.capital;
// every name of each that counts as a typed answer in this language (English ones count too: see subjects.js)
const nameForms = (c) => NAMES.countries[c.id] || [];
const capitalForms = (c) => NAMES.capitals[c.id] || [];
// the map's other places (Greenland, Puerto Rico…), and the names of seas, lakes and rivers, by their English name
const placeName = (en) => (en && NAMES.places[en]) || en;
const waterName = (en) => (en && NAMES.water[en]) || en;
// a language's name in the language in use ("German" in English, "allemand" in French)
const langName = (code) => NAMES.langs[code] || null;

return { EN, LANGS, lang, locale, hasUi, setSubject, setLanguage, t, uiText, nameOf, capitalOf, nameForms, capitalForms, placeName, waterName, langName };
})();
const { EN, LANGS, lang, locale, hasUi, setSubject, setLanguage, t, uiText, nameOf, capitalOf, placeName, waterName, langName } = __TEXT;
const localNames = __TEXT.nameForms, localCapitals = __TEXT.capitalForms;

const __SUBJECTS = (function(){
// What the tool asks about each country. World Capitals, World Countries and World Flags are one tool
// (app.js: the map, the regions, Study / Practice / Test, click and type questions) with three subjects.
// Each page says which with <html data-subject="…">: no attribute means World Capitals. Everything
// that differs between them is here, and nothing here touches the page. The words are in text.js.
/* ---------------- typed answers ---------------- */
// Letters only, accents off, lower case: "São Tomé" -> "saotome". Letters of any alphabet count (Москва,
// 東京, القاهرة), so a name typed in any language compares; the few Latin letters with no accent to take
// off (ø, ß, ł…) become the plain letters people type for them.
const PLAIN = { ø: 'o', æ: 'ae', œ: 'oe', ß: 'ss', ł: 'l', đ: 'd', ð: 'd', þ: 'th', ı: 'i' };
const norm = (s) =>
	String(s)
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/\bst\b\.?/g, 'saint')
		.replace(/[øæœßłđðþı]/g, (ch) => PLAIN[ch])
		.replace(/[^\p{L}\p{M}\p{N}]/gu, '');
function editDistance(a, b) {
	const m = a.length, n = b.length;
	const d = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
	for (let j = 1; j <= n; j++) d[0][j] = j;
	for (let i = 1; i <= m; i++)
		for (let j = 1; j <= n; j++) {
			d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
		}
	return d[m][n];
}

/* ---------------- country names ---------------- */
// Other names that count as right when a country's name is typed: full official names and the short
// names people use. Not a part for the whole (England, Holland) and not an ambiguous one (Korea, Congo).
const COUNTRY_ALTS = {
	USA: ['United States of America', 'USA', 'US', 'America'],
	GBR: ['UK', 'Great Britain', 'Britain'],
	ARE: ['UAE', 'Emirates'],
	COD: ['Democratic Republic of the Congo', 'DRC', 'Congo-Kinshasa'],
	COG: ['Congo-Brazzaville', 'Republic of Congo'],
	KOR: ['Republic of Korea'],
	PRK: ['DPRK'],
	CZE: ['Czech Republic'],
	TUR: ['Turkey'],
	CPV: ['Cape Verde'],
	TLS: ['East Timor'],
	CIV: ['Ivory Coast'],
	MMR: ['Burma'],
	VAT: ['Vatican', 'Holy See'],
	FSM: ['Federated States of Micronesia'],
	PSX: ['State of Palestine'],
	CAF: ['CAR'],
	BIH: ['Bosnia-Herzegovina', 'Bosnia'],
	RUS: ['Russian Federation'],
	CHN: ["People's Republic of China"],
	TWN: ['Republic of China'],
	VNM: ['Viet Nam'],
	LAO: ['Lao'],
	SYR: ['Syrian Arab Republic'],
	BRN: ['Brunei Darussalam'],
	MKD: ['Macedonia'],
	KNA: ['Saint Christopher and Nevis'],
	PNG: ['PNG'],
	NZL: ['NZ'],
};
// Old names: typing one gets "that's its old name" instead of a plain wrong answer
const COUNTRY_FORMER = {
	SWZ: ['Swaziland'],
	LKA: ['Ceylon'],
	BFA: ['Upper Volta'],
	BEN: ['Dahomey'],
	KHM: ['Kampuchea'],
	THA: ['Siam'],
	ZWE: ['Rhodesia'],
	COD: ['Zaire'],
	IRN: ['Persia'],
};
// Every spelling of a country's name that counts: with and without "the" in front ("The Gambia"),
// and with "and" left out ("Antigua & Barbuda" types as "Antigua Barbuda")
function nameForms(c) {
	const out = [];
	for (const s of [c.name, ...(COUNTRY_ALTS[c.id] || [])]) {
		out.push(s, 'The ' + s);
		if (/\band\b/.test(s)) out.push(s.replace(/\band\b/g, ' '));
	}
	return out;
}

/* ---------------- flags ---------------- */
// Shown with a flag once it has been answered or looked at (never before: it would give it away)
const FLAG_NOTES = {
	AFG: 'This is the flag of the Islamic Republic, still used by the UN, the Olympics and many embassies. Since 2021 the Taliban government has used a white flag with the shahada in black.',
	SYR: 'Adopted in 2025, after the fall of the Assad government. Until then Syria’s flag was red, white and black with two green stars.',
	KGZ: 'Redrawn in 2023 with straight rays; the old flag’s rays were wavy.',
	TCD: 'Almost the same as Romania’s: Chad’s blue is a little darker.',
	ROU: 'Almost the same as Chad’s: Romania’s blue is a little lighter.',
	IDN: 'The same red over white as Monaco’s, but longer (2:3; Monaco’s is 4:5).',
	MCO: 'The same red over white as Indonesia’s, but squarer (4:5; Indonesia’s is 2:3).',
	NLD: 'Like Luxembourg’s, with a darker blue and a shorter shape.',
	LUX: 'Like the Netherlands’, with a lighter blue and a longer shape.',
	IRL: 'Green on the left (by the pole). Côte d’Ivoire’s is the same colours the other way round.',
	CIV: 'Orange on the left (by the pole). Ireland’s is the same colours the other way round.',
	AUS: 'Six white stars. New Zealand’s has four red ones and no small star.',
	NZL: 'Four red stars outlined in white. Australia’s has six white ones.',
	SEN: 'Like Mali’s, with a green star in the middle.',
	MLI: 'Green, yellow and red from the pole. Senegal’s adds a green star; Guinea’s has the same colours the other way round.',
	GIN: 'Red, yellow and green from the pole. Mali’s has the same colours the other way round.',
	COL: 'The yellow takes the top half. Ecuador’s is the same, with its coat of arms in the middle.',
	ECU: 'Like Colombia’s, with Ecuador’s coat of arms in the middle.',
	VEN: 'Yellow, blue and red in equal stripes, with an arc of eight stars.',
	SVN: 'White, blue and red, with Slovenia’s coat of arms (Mount Triglav) near the top left.',
	SVK: 'White, blue and red, with Slovakia’s coat of arms (a double cross on three hills) toward the pole.',
	RUS: 'White, blue and red, with no coat of arms.',
	NOR: 'A blue cross outlined in white on red. Iceland’s is the same with the colours swapped.',
	ISL: 'A red cross outlined in white on blue. Norway’s is the same with the colours swapped.',
	QAT: 'Maroon, and long (11:28). Bahrain’s is red and has five points.',
	BHR: 'Red, with five white points. Qatar’s is maroon, longer and has nine.',
	NPL: 'The only national flag that isn’t a rectangle.',
	CHE: 'Square, like the Vatican’s.',
	VAT: 'Square, like Switzerland’s.',
};
// The picture of a country's flag (World Flags only): flag-atlas/flags/<id>.svg, from the folder of this file
const flagUrl = (id) => `../flag-atlas/flags/${id}.svg`;

/* ---------------- the three subjects ---------------- */
// A capital's note (countries.json) and a flag's note, in the language in use where they've been translated
const note = (c) => uiText('note.' + c.id) ?? c.note ?? '';
const flagNote = (c) => uiText('flag.' + c.id) ?? FLAG_NOTES[c.id] ?? '';
const join = (...parts) => parts.filter(Boolean).join(' ');
const capitals = {
	key: 'capitals',
	tool: 'capital-atlas', // the folder, and the id its progress is saved under
	name: 'World Capitals',
	answer: (c) => capitalOf(c), // what a typed answer has to be (as shown)
	// what counts: the capital in the language in use, and in English with its other names
	forms: (c) => [...localCapitals(c), c.capital, ...(c.alts || [])],
	former: (c) => c.formerly || [],
	formerMsg: (typed) => t('capitals.former', { typed }),
	otherMsg: (o) => t('capitals.other', { capital: capitalOf(o), name: nameOf(o) }),
	tell: (c) => t('capitals.tell', { name: nameOf(c), capital: capitalOf(c) }),
	fact: (c) => t('capitals.fact', { name: nameOf(c), capital: capitalOf(c) }), // a country named, with what it teaches
	outside: (c, region) => t('capitals.outside', { name: nameOf(c), capital: capitalOf(c), region }),
	missClick: (c) => t('capitals.miss_click', { name: nameOf(c) }), // a wrong click: c was asked for
	callout: (c) => ({ title: capitalOf(c), sub: nameOf(c) }),
	label: (c) => capitalOf(c), // on the spinning globe
	dots: true, // a dot on every capital
	waterNames: true, // the names of oceans, seas, lakes and rivers show until a visitor turns them off (L)
	around: [7, 4.5], // the least a view of one country shows: degrees of longitude and latitude each side of its middle
	lightTyped: true, // typed questions light up the country being asked about
	namesAnswer: false, // a country's name answers a question (so voice can't fly to one mid-quiz)
	placeholder: () => t('capitals.placeholder'),
	study: (c) => ({ name: t('capitals.pair', { name: nameOf(c), capital: capitalOf(c) }), tip: note(c) }),
	clickAsk: (c) => ({ eyebrow: t('capitals.click_ask'), name: capitalOf(c) }),
	clickReveal: (c) => ({ eyebrow: t('here_it_is'), name: capitalOf(c), tip: join(t('capitals.capital_of', { capital: capitalOf(c), name: nameOf(c) }), note(c)) }),
	typeAsk: (c) => ({ eyebrow: t('capitals.type_ask'), name: nameOf(c) }),
	typeReveal: (c) => ({ eyebrow: t('capitals.type_reveal', { name: nameOf(c) }), name: capitalOf(c), tip: join(t('type_it'), note(c)) }),
	hint: (k) => t('capitals.' + k + '_hint'), // study, click, type, type_hard
};
const countries = {
	key: 'countries',
	tool: 'country-atlas',
	name: 'World Countries',
	answer: (c) => nameOf(c),
	forms: (c) => [...localNames(c), ...nameForms(c)],
	former: (c) => COUNTRY_FORMER[c.id] || [],
	formerMsg: (typed) => t('countries.former', { typed }),
	otherMsg: (o) => t('countries.other', { name: nameOf(o) }),
	tell: (c) => t('countries.tell', { name: nameOf(c) }),
	fact: (c) => t('countries.fact', { name: nameOf(c) }),
	outside: (c, region) => t('countries.outside', { name: nameOf(c), region }),
	missClick: (c, clicked) => t('countries.miss_click', { name: nameOf(c), clicked: nameOf(clicked) }),
	callout: (c) => ({ title: nameOf(c), sub: '' }),
	label: (c) => nameOf(c),
	dots: false,
	waterNames: false, // off at first: the map is for finding countries; L or the Names button turns them on
	around: [16, 10],
	lightTyped: true,
	namesAnswer: true,
	placeholder: () => t('countries.placeholder'),
	study: (c) => ({ name: nameOf(c), tip: '' }),
	clickAsk: (c) => ({ eyebrow: t('countries.click_ask'), name: nameOf(c) }),
	clickReveal: (c) => ({ eyebrow: t('here_it_is'), name: nameOf(c), tip: '' }),
	typeAsk: () => ({ eyebrow: t('countries.type_ask'), name: t('countries.the_glowing') }),
	typeReveal: (c) => ({ eyebrow: t('countries.type_reveal'), name: nameOf(c), tip: t('type_it') }),
	hint: (k) => t('countries.' + k + '_hint'),
};
const flags = {
	...countries,
	key: 'flags',
	tool: 'flag-atlas',
	name: 'World Flags',
	formerMsg: (typed) => t('flags.former', { typed }),
	otherMsg: (o) => t('flags.other', { name: nameOf(o) }),
	tell: (c) => t('flags.tell', { name: nameOf(c) }),
	fact: (c) => t('flags.fact', { name: nameOf(c) }),
	outside: (c, region) => t('flags.outside', { name: nameOf(c), region }),
	missClick: (c, clicked) => t('flags.miss_click', { name: nameOf(c), clicked: nameOf(clicked) }),
	callout: (c) => ({ title: nameOf(c), sub: '', flag: c.id }),
	lightTyped: false, // the flag is the question: lighting the country would give the answer away
	placeholder: () => t('flags.placeholder'),
	study: (c) => ({ name: nameOf(c), flag: c.id, tip: flagNote(c) }),
	clickAsk: (c) => ({ eyebrow: t('flags.click_ask'), name: '', flag: c.id }),
	clickReveal: (c) => ({ eyebrow: t('here_it_is'), name: nameOf(c), flag: c.id, tip: flagNote(c) }),
	typeAsk: (c) => ({ eyebrow: t('flags.type_ask'), name: '', flag: c.id }),
	typeReveal: (c) => ({ eyebrow: t('flags.type_reveal'), name: nameOf(c), flag: c.id, tip: join(t('type_it'), flagNote(c)) }),
	hint: (k) => t('flags.' + k + '_hint'),
};
const SUBJECTS = { capitals, countries, flags };
const subjectFor = (key) => SUBJECTS[key] || capitals;

/* ---------------- checking a typed answer ---------------- */
// -> checkAnswer(c, typed, { strict, keepSecret }): { ok, note } or { ok: false, msg }; a near miss in
// Easy is { ok: true, close: true, note } (half a point).
// strict: spelling must be exact (accents, capitals and punctuation still don't matter).
// keepSecret: a wrong answer's message doesn't give the answer away.
// The checker knows the names in the language in use when it is made: make a new one after a language change.
function makeChecker(S, list) {
	const index = new Map(); // a normalised answer -> the country it belongs to
	for (const c of list) for (const s of S.forms(c)) if (norm(s) && !index.has(norm(s))) index.set(norm(s), c);
	return function checkAnswer(c, typed, { strict = false, keepSecret = false } = {}) {
		const n = norm(typed);
		const forms = S.forms(c).map(norm).filter(Boolean);
		if (n && forms.includes(n)) return { ok: true };
		const tell = ' ' + (keepSecret ? t('try_again') : S.tell(c));
		if (S.former(c).map(norm).includes(n)) return { ok: false, msg: S.formerMsg(typed.trim()) + tell };
		const other = index.get(n);
		if (other && other !== c) return { ok: false, msg: S.otherMsg(other) + tell };
		const slack = strict ? 0 : n.length >= 8 ? 2 : n.length >= 5 ? 1 : 0;
		if (slack && forms.some((f) => editDistance(n, f) <= slack)) return { ok: true, close: true, note: t('close_note', { answer: S.answer(c) }) };
		if (keepSecret) return { ok: false, msg: t('not_quite') };
		const near = strict && forms.some((f) => editDistance(n, f) <= (n.length >= 8 ? 2 : 1));
		return { ok: false, msg: near ? t('so_close_hard', { answer: S.answer(c) }) : S.fact(c) };
	};
}

return { norm, editDistance, COUNTRY_ALTS, COUNTRY_FORMER, nameForms, FLAG_NOTES, flagUrl, SUBJECTS, subjectFor, makeChecker };
})();
const { norm, subjectFor, makeChecker, flagUrl } = __SUBJECTS;

(function(){
// World Capitals (formerly Capital Atlas; the folder and saved-progress id stay capital-atlas): learn the capital of every country on a 3D globe or a flat map.
// Built like Bone Atlas: Study, Practice and Test, by region, with two kinds of question
// (click the country for a capital, or type the capital of a highlighted country).
// The same page code runs World Countries (country-atlas/) and World Flags (flag-atlas/): each page
// says which with <html data-subject="…">, and what differs between them is in subjects.js.
// There's also a hidden Images mode (press I, or open the page with #images): Study with your own
// pictures pasted onto countries as memory hooks. See "image mode" below.
// The map is drawn on two canvases: `map` (land and sea, redrawn when the view moves) and
// `fx` (highlights, capital dots, flashes; cheap to redraw every frame).
const $ = (id) => document.getElementById(id);
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const SPHERE = { type: 'Sphere' };
const GRAT = geoGraticule10();

/* ---------------- what this page teaches ---------------- */
const S = subjectFor(document.documentElement.dataset.subject);
setSubject(S.key);
// the map files are World Capitals' own, wherever the page is
const DATA = '../capital-atlas/data/';

/* ---------------- storage (per-browser, optional) ---------------- */
const store = window.SiteProgress ? window.SiteProgress.tool(S.tool) : { get: (k, d) => d, set() {} };

/* ---------------- regions and places to zoom to ---------------- */
const REGIONS = [
	{ key: 'world', label: 'World' },
	{ key: 'europe', label: 'Europe' },
	{ key: 'asia', label: 'Asia' },
	{ key: 'north-america', label: 'North America' },
	{ key: 'south-america', label: 'South America' },
	{ key: 'africa', label: 'Africa' },
	{ key: 'oceania', label: 'Oceania' },
];
// Subregions: each big continent split into a few groups of neighbouring countries (South America
// stays whole). box = what the map frames for it, same format as AREAS below.
const SUBREGIONS = [
	{ key: 'north-central-america', parent: 'north-america', label: 'North & Central America', box: [-170, 7, -52, 72],
		ids: ['CAN', 'USA', 'MEX', 'GTM', 'BLZ', 'HND', 'SLV', 'NIC', 'CRI', 'PAN'] },
	{ key: 'caribbean', parent: 'north-america', label: 'Caribbean', box: [-86, 10, -59, 27],
		ids: ['CUB', 'JAM', 'HTI', 'DOM', 'BHS', 'KNA', 'ATG', 'DMA', 'LCA', 'VCT', 'BRB', 'GRD', 'TTO'] },
	{ key: 'northern-europe', parent: 'europe', label: 'Northern Europe', box: [-25, 50, 32, 71],
		ids: ['GBR', 'IRL', 'ISL', 'NOR', 'SWE', 'FIN', 'DNK', 'EST', 'LVA', 'LTU'] },
	{ key: 'western-europe', parent: 'europe', label: 'Western Europe', box: [-6, 41, 18, 56],
		ids: ['FRA', 'BEL', 'NLD', 'LUX', 'MCO', 'DEU', 'CHE', 'LIE', 'AUT'] },
	{ key: 'southern-europe', parent: 'europe', label: 'Southern Europe', box: [-10, 34, 35, 47.5],
		ids: ['PRT', 'ESP', 'AND', 'ITA', 'SMR', 'VAT', 'MLT', 'SVN', 'HRV', 'BIH', 'SRB', 'MNE', 'KOS', 'ALB', 'MKD', 'GRC', 'CYP'] },
	{ key: 'eastern-europe', parent: 'europe', label: 'Eastern Europe', box: [12, 41, 50, 61],
		ids: ['POL', 'CZE', 'SVK', 'HUN', 'ROU', 'BGR', 'MDA', 'UKR', 'BLR', 'RUS'] },
	{ key: 'east-asia', parent: 'asia', label: 'East Asia', box: [73, 18, 146, 54],
		ids: ['CHN', 'JPN', 'PRK', 'KOR', 'MNG', 'TWN'] },
	{ key: 'southeast-asia', parent: 'asia', label: 'Southeast Asia', box: [92, -11, 141, 28],
		ids: ['MMR', 'THA', 'LAO', 'KHM', 'VNM', 'MYS', 'SGP', 'IDN', 'BRN', 'PHL', 'TLS'] },
	{ key: 'south-central-asia', parent: 'asia', label: 'South & Central Asia', box: [46, -1, 98, 56],
		ids: ['IND', 'PAK', 'AFG', 'BGD', 'NPL', 'BTN', 'LKA', 'MDV', 'KAZ', 'UZB', 'TKM', 'KGZ', 'TJK'] },
	{ key: 'middle-east', parent: 'asia', label: 'Middle East', box: [25, 12, 64, 44],
		ids: ['TUR', 'GEO', 'ARM', 'AZE', 'IRN', 'IRQ', 'SYR', 'LBN', 'ISR', 'PSX', 'JOR', 'SAU', 'YEM', 'OMN', 'ARE', 'QAT', 'BHR', 'KWT'] },
	{ key: 'north-africa', parent: 'africa', label: 'North Africa', box: [-18, 7, 39, 38],
		ids: ['MAR', 'DZA', 'TUN', 'LBY', 'EGY', 'SDN', 'TCD'] },
	{ key: 'west-africa', parent: 'africa', label: 'West Africa', box: [-26, -4, 17, 27.5],
		ids: ['MRT', 'SEN', 'GMB', 'GNB', 'GIN', 'SLE', 'LBR', 'CPV', 'MLI', 'BFA', 'NER', 'CIV', 'GHA', 'TGO', 'BEN', 'NGA', 'CMR', 'GNQ', 'GAB', 'STP'] },
	{ key: 'east-africa', parent: 'africa', label: 'East Africa', box: [14, -26, 58, 18.5],
		ids: ['ERI', 'DJI', 'ETH', 'SOM', 'SDS', 'CAF', 'KEN', 'UGA', 'RWA', 'BDI', 'TZA', 'MDG', 'COM', 'MUS', 'SYC'] },
	{ key: 'southern-africa', parent: 'africa', label: 'Southern Africa', box: [11, -35, 41, 5.5],
		ids: ['COG', 'COD', 'AGO', 'ZMB', 'MWI', 'MOZ', 'ZWE', 'NAM', 'BWA', 'ZAF', 'LSO', 'SWZ'] },
	{ key: 'australia-melanesia', parent: 'oceania', label: 'Australia & Melanesia', box: [112, -48, 183, 0],
		ids: ['AUS', 'NZL', 'PNG', 'SLB', 'VUT', 'FJI'] },
	{ key: 'micronesia-polynesia', parent: 'oceania', label: 'Micronesia & Polynesia', box: [130, -23, 192, 15],
		ids: ['PLW', 'FSM', 'MHL', 'NRU', 'KIR', 'WSM', 'TON', 'TUV'] },
];
const REGION = Object.fromEntries([...REGIONS, ...SUBREGIONS].map((r) => [r.key, r]));
const SUB_IDS = new Map(SUBREGIONS.map((s) => [s.key, new Set(s.ids)]));
// [west, south, east, north] in degrees; east goes past 180 for areas that cross the date line
const AREAS = {
	world: { label: 'World', box: null },
	europe: { label: 'Europe', box: [-25, 34, 45, 71] },
	asia: { label: 'Asia', box: [25, -11, 150, 55] },
	'north-america': { label: 'North America', box: [-170, 7, -52, 72] },
	'south-america': { label: 'South America', box: [-82, -56, -34, 13] },
	africa: { label: 'Africa', box: [-26, -36, 58, 38] },
	oceania: { label: 'Oceania', box: [110, -48, 200, 20] },
	caribbean: { label: 'Caribbean', box: [-86, 10, -59, 27] },
	'middle-east': { label: 'Middle East', box: [25, 12, 63, 42] },
	pacific: { label: 'Pacific islands', box: [130, -25, 200, 15] },
	'central-america': { label: 'Central America', box: [-93, 7, -77, 19] },
	'lesser-antilles': { label: 'Lesser Antilles', box: [-64, 11, -59, 19] },
	'southeast-asia': { label: 'Southeast Asia', box: [92, -11, 141, 28] },
	'east-asia': { label: 'East Asia', box: [100, 18, 146, 53] },
	'south-asia': { label: 'South Asia', box: [60, 5, 98, 37] },
	'central-asia': { label: 'Central Asia', box: [46, 35, 88, 56] },
	'persian-gulf': { label: 'Persian Gulf', box: [46, 22, 58, 31] },
	balkans: { label: 'Balkans', box: [13, 39, 30, 47] },
	scandinavia: { label: 'Scandinavia', box: [4, 54, 32, 71] },
	'western-europe': { label: 'Western Europe', box: [-11, 36, 17, 56] },
	'eastern-europe': { label: 'Eastern Europe', box: [14, 41, 41, 60] },
	'north-africa': { label: 'North Africa', box: [-18, 15, 36, 38] },
	'west-africa': { label: 'West Africa', box: [-18, 3, 16, 25] },
	'central-africa': { label: 'Central Africa', box: [8, -14, 32, 12] },
	'east-africa': { label: 'East Africa', box: [28, -12, 52, 16] },
	'southern-africa': { label: 'Southern Africa', box: [11, -35, 41, -8] },
	polynesia: { label: 'Polynesia', box: [170, -25, 200, -7] },
	melanesia: { label: 'Melanesia', box: [140, -23, 180, 0] },
	'micronesia-region': { label: 'Micronesia (region)', box: [130, -2, 175, 15] },
};
// the ones the page shows (rail and zoom buttons) are translated; the rest are only for voice, which is English
const EN_REGION = new Set([...REGIONS, ...SUBREGIONS].map((r) => r.key).concat('pacific'));
// every subregion is also a place to zoom to (this replaces the older boxes of the same name)
for (const s of SUBREGIONS) AREAS[s.key] = { label: s.label, box: s.box };
const ZOOM_KEYS = ['world', 'europe', 'asia', 'north-america', 'south-america', 'africa', 'oceania', 'caribbean', 'middle-east', 'pacific'];

/* ---------------- state ---------------- */
const oneOf = (v, list, d) => (list.includes(v) ? v : d);
const state = {
	mode: oneOf(store.get('mode', 'study'), ['study', 'practice', 'test'], 'study'),
	format: oneOf(store.get('format', 'click'), ['click', 'type'], 'click'),
	region: oneOf(store.get('region', 'world'), Object.keys(REGION), 'world'),
	view: oneOf(store.get('view', 'globe'), ['globe', 'map'], 'globe'),
	level: oneOf(store.get('level', 'easy'), ['easy', 'hard'], 'easy'),
	clean: false,
	names: store.get('waterNames', S.waterNames) !== false, // names of oceans, seas, lakes and rivers (on or off at first: subjects.js)
	zoomArea: null, // the zoom chip the view was last set to (cleared by moving the map by hand)
	pins: false, // the hidden Images mode: Study, plus your own pictures pinned to countries
	pinSize: 2, // which of PIN_SIZES the pictures are drawn at
};
// Images mode is part of Study. It comes back after a reload if you left it on, and #images turns it on.
if (location.hash === '#images') {
	state.mode = 'study';
	state.pins = true;
	store.set('mode', 'study');
	store.set('imageMode', true);
} else state.pins = state.mode === 'study' && store.get('imageMode', false) === true;
{
	const n = Number(store.get('imageSize', 2));
	state.pinSize = Number.isFinite(n) ? Math.min(4, Math.max(0, Math.round(n))) : 2;
}

let COUNTRIES = [];
const BY_ID = new Map();
const LOD = { xlow: null, low: null, mid: null, high: null }; // GeoJSON features at four levels of detail (same order)
let META = []; // per feature: { i, id, country, name, of, c, r, area, box }

const inRegion = (c, key) => key === 'world' || c.region === key || (SUB_IDS.has(key) && SUB_IDS.get(key).has(c.id));
const inScope = (c) => inRegion(c, state.region);
const scopeCountries = () => COUNTRIES.filter(inScope);
// a region's or zoom area's name, in the language in use (the English label where it has no translation)
const regionName = (k) => (EN_REGION.has(k) ? t('region.' + k) : (AREAS[k] || REGION[k]).label);
const regionLabel = (k = state.region) => regionName(k);

/* ---------------- typed answers ---------------- */
// checkAnswer(c, typed, { strict, keepSecret }), made when the countries have loaded (subjects.js)
let checkAnswer = () => ({ ok: false, msg: '' });

/* ---------------- layout: the area the panels leave free ---------------- */
const layout = { w: 1, h: 1, left: 0, right: 0, top: 0, bottom: 0 };
const narrow = () => window.innerWidth <= 900;
function measureInsets() {
	const w = window.innerWidth, h = window.innerHeight, wide = w > 900;
	if (spin.on) return { w, h, top: 0, bottom: 0, left: 0, right: 0 }; // the spinning globe has the whole screen
	const vis = (el) => el && !el.hidden && el.offsetParent !== null;
	let top = 0, bottom = 0, left = 0, right = 0;
	for (const id of ['prompt', 'stats'].concat(wide ? [] : ['rail'])) {
		const el = $(id);
		if (vis(el)) top = Math.max(top, el.getBoundingClientRect().bottom + 6);
	}
	// the dock row: the same space whichever buttons it shows, so the map doesn't move between modes
	if (!state.clean) bottom = h - document.querySelector('.dock').getBoundingClientRect().bottom + 44;
	if (wide && !state.clean) {
		if (vis($('panel'))) right = w - $('panel').getBoundingClientRect().left + 8;
		for (const id of ['rail', 'viewCard']) if (vis($(id))) left = Math.max(left, $(id).getBoundingClientRect().right + 8);
	}
	return { w, h, top: Math.min(top, h * 0.45), bottom: Math.min(bottom, h * 0.3), left: Math.min(left, w * 0.3), right: Math.min(right, w * 0.35) };
}
function free() {
	const x0 = layout.left, x1 = layout.w - layout.right, y0 = layout.top, y1 = layout.h - layout.bottom;
	return { x0, x1, y0, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, fw: Math.max(1, x1 - x0), fh: Math.max(1, y1 - y0) };
}

/* ---------------- camera and projections ---------------- */
// One camera for both views: the point in the middle of the free area, and a zoom (1 = whole world).
const cam = { lon: 10, lat: 15, zoom: 1 };
// The hidden spinning globe (see "spinning globe" below). level 1-3; speed eases toward SPIN_SPEEDS[level];
// labels: capital id -> { a: how visible its name is, left: drawn left of the dot }
const SPIN_SPEEDS = [0, 6, 15, 36]; // degrees a second: a turn a minute, every 24 s, every 10 s
const spin = { on: false, level: 0, speed: 0, last: 0, fxLast: 0, back: null, labels: new Map() };
let mapBase = 100;
const baseScale = (view = state.view) => (view === 'globe' ? Math.min(free().fw, free().fh) * 0.46 : mapBase);
function computeMapBase() {
	const f = free();
	mapBase = geoNaturalEarth1().fitSize([f.fw, f.fh], SPHERE).scale() * 0.97;
}
function projFor(c = cam, view = state.view) {
	const f = free();
	if (view === 'globe') {
		return geoOrthographic().rotate([-c.lon, -c.lat]).translate([f.cx, f.cy]).scale(baseScale('globe') * c.zoom).clipAngle(90).precision(0);
	}
	const p = geoNaturalEarth1().rotate([-c.lon, 0]).scale(mapBase * c.zoom).translate([0, 0]).precision(0);
	const [x, y] = p([c.lon, c.lat]);
	return p.translate([f.cx - x, f.cy - y]);
}
const ZOOM_LIMITS = { globe: [0.7, 90], map: [1, 140] };
function constrain(c = cam, view = state.view) {
	const [z0, z1] = ZOOM_LIMITS[view];
	c.zoom = Math.min(z1, Math.max(z0, c.zoom));
	c.lon = ((((c.lon + 180) % 360) + 360) % 360) - 180;
	c.lat = Math.max(-85, Math.min(85, c.lat));
	if (view === 'map') {
		// keep the flat map covering the view top to bottom (or centred when it all fits)
		const p = projFor(c, 'map'), f = free();
		const [[, y0], [, y1]] = geoPath(p).bounds(SPHERE);
		let dy = 0;
		if (y1 - y0 <= f.fh) dy = f.cy - (y0 + y1) / 2;
		else if (y0 > f.y0) dy = f.y0 - y0;
		else if (y1 < f.y1) dy = f.y1 - y1;
		if (Math.abs(dy) > 0.5) {
			const ll = p.invert([f.cx, f.cy - dy]);
			if (ll && isFinite(ll[1])) c.lat = ll[1];
		}
	}
	return c;
}
let proj = null;
function updateProj() {
	proj = projFor();
}
function boxPoints([w, s, e, n]) {
	const pts = [];
	for (let i = 0; i <= 16; i++) {
		const t = i / 16;
		pts.push([w + (e - w) * t, s], [w + (e - w) * t, n], [w, s + (n - s) * t], [e, s + (n - s) * t]);
	}
	return { type: 'MultiPoint', coordinates: pts };
}
// The camera that fits a [w, s, e, n] box into the free area
function camForBox(box, view = state.view, pad = 18) {
	if (!box) return constrain(view === 'globe' ? { lon: cam.lon, lat: 15, zoom: 1 } : { lon: 10, lat: 0, zoom: 1 }, view);
	const [w, s, e, n] = box;
	const lon = (w + e) / 2, lat = (s + n) / 2;
	const f = free();
	const ext = [[f.x0 + pad, f.y0 + pad], [f.x1 - pad, f.y1 - pad]];
	const geo = boxPoints(box);
	if (view === 'globe') {
		const p = geoOrthographic().rotate([-lon, -lat]).clipAngle(90).fitExtent(ext, geo);
		return constrain({ lon, lat, zoom: p.scale() / baseScale('globe') }, 'globe');
	}
	const p = geoNaturalEarth1().rotate([-lon, 0]).fitExtent(ext, geo);
	const ll = p.invert([f.cx, f.cy]);
	return constrain({ lon: ll[0], lat: ll[1], zoom: p.scale() / mapBase }, 'map');
}
// Frame a country with some of its surroundings (tiny countries get at least ~14° of context; on World
// Countries and World Flags more, since the neighbours are how you tell a country from its shape)
function camForCountry(c, view = state.view) {
	const [[w, s], [e, n]] = META[c.fi].box;
	const E = e < w ? e + 360 : e;
	const cx = (w + E) / 2, cy = (s + n) / 2;
	const hw = Math.max((E - w) / 2, S.around[0]), hh = Math.max((n - s) / 2, S.around[1]);
	return camForBox([cx - hw, cy - hh, cx + hw, cy + hh], view, 48);
}

/* ---------------- moving the camera ---------------- */
let fly = null, moving = false, settleTimer = 0;
function interacting() {
	moving = true;
	clearTimeout(settleTimer);
}
function settle() {
	clearTimeout(settleTimer);
	settleTimer = setTimeout(() => {
		moving = false;
		invalidate();
	}, 150);
}
function flyTo(target, ms = 700) {
	const to = constrain({ ...target });
	const from = { ...cam };
	const dl = ((((to.lon - from.lon + 180) % 360) + 360) % 360) - 180;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) ms = 0;
	// straight there: turn and zoom together, no zooming out on the way
	fly = { from, to, dl, t0: performance.now(), ms };
	interacting();
	invalidate();
}
function stepFly(now) {
	if (!fly) return;
	const k = fly.ms ? Math.min(1, (now - fly.t0) / fly.ms) : 1;
	const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
	cam.lon = fly.from.lon + fly.dl * e;
	cam.lat = fly.from.lat + (fly.to.lat - fly.from.lat) * e;
	cam.zoom = Math.exp(Math.log(fly.from.zoom) + (Math.log(fly.to.zoom) - Math.log(fly.from.zoom)) * e);
	constrain();
	updateProj();
	baseDirty = true;
	if (k >= 1) {
		fly = null;
		settle();
	}
}
function cancelFly() {
	if (fly) {
		fly = null;
		settle();
	}
}
function zoomAround(x, y, factor) {
	cancelFly();
	const before = proj.invert([x, y]);
	cam.zoom *= factor;
	constrain();
	updateProj();
	const after = proj.invert([x, y]);
	const okPt = (ll) => ll && isFinite(ll[0]) && isFinite(ll[1]);
	if (okPt(before) && okPt(after) && (state.view === 'map' || geoDistance(before, [cam.lon, cam.lat]) < Math.PI / 2)) {
		cam.lon += before[0] - after[0];
		cam.lat += before[1] - after[1];
		constrain();
		updateProj();
	}
	state.zoomArea = null;
	renderZoom();
	interacting();
	settle();
	invalidate();
}
function frameArea(key, ms) {
	state.zoomArea = key;
	renderZoom();
	flyTo(camForBox(AREAS[key].box), ms);
}
const frameRegion = (ms) => frameArea(state.region, ms);

/* ---------------- map data ---------------- */
function eachPoint(geom, fn) {
	const walk = (a) => (typeof a[0] === 'number' ? fn(a) : a.forEach(walk));
	walk(geom.coordinates);
}
function useTopology(topo) {
	return feature(topo, topo.objects.land).features;
}
const SCATTERED = new Set(['KIR', 'FSM', 'MHL', 'CPV']); // island groups spread over a lot of ocean
function buildMeta(feats) {
	META = feats.map((f, i) => {
		const p = f.properties;
		const country = p.id ? BY_ID.get(p.id) : null;
		if (country) country.fi = i;
		const c = geoCentroid(f);
		let r = 0;
		eachPoint(f.geometry, (pt) => {
			r = Math.max(r, geoDistance(c, pt));
		});
		const area = geoArea(f);
		// microstates and small island nations get a ring you can click while they're too small to see
		const small = !!country && (area * 6371 ** 2 < 3000 || SCATTERED.has(p.id));
		return { i, id: p.id || null, country, name: country ? country.name : p.name, of: p.of || null, c, r: r + 0.03, area, small, box: geoBounds(f) };
	});
}
function inBox(box, [lon, lat]) {
	const [[w, s], [e, n]] = box;
	if (lat < s - 0.01 || lat > n + 0.01) return false;
	return w <= e ? lon >= w - 0.01 && lon <= e + 0.01 : lon >= w - 0.01 || lon <= e + 0.01;
}
let highRequested = false;
function requestHigh() {
	if (highRequested) return;
	highRequested = true;
	window.__offlineFetchCap(DATA + 'map-high.json')
		.then((r) => r.json())
		.then((t) => {
			LOD.high = useTopology(t);
			refreshMeta(LOD.high);
			invalidate();
		})
		.catch(() => {
			highRequested = false;
		});
}
const LEVELS = ['xlow', 'low', 'mid', 'high'];
function lodName(p) {
	const ppd = p.scale() * DEG;
	let want = ppd < 5 ? 0 : ppd < 14 ? 1 : ppd < 70 ? 2 : 3;
	// on slow devices, one level less while the map moves (except very close in, where few shapes are on screen)
	if (moving && slowDevice && want > 0 && !(want === 3 && ppd > 120)) want--;
	if (want === 3 && !LOD.high) requestHigh();
	while (want > 0 && !LOD[LEVELS[want]]) want--;
	return LEVELS[want];
}
const bestFeats = () => LOD.high || LOD.mid || LOD.low || LOD.xlow;
// Better shapes have arrived: refresh the outlines used for picking and for spotting tiny countries
function refreshMeta(feats) {
	for (const m of META) {
		const f = feats[m.i];
		m.area = geoArea(f);
		m.small = !!m.country && (m.area * 6371 ** 2 < 3000 || SCATTERED.has(m.id));
		m.box = geoBounds(f);
	}
}

/* ---------------- drawing ---------------- */
const mapCv = $('map'), fxCv = $('fx'), lblCv = $('labels');
const bctx = mapCv.getContext('2d'), fctx = fxCv.getContext('2d'), lctx = lblCv.getContext('2d');
// slowDevice: drawing the map while it moves took too long, so moving frames use less detail
let dpr = 1, baseDirty = true, raf = 0, drawnFeats = null, slowDevice = false;
const COL = {
	inScope: '#c6bba2',
	outScope: '#4b585f',
	territory: '#384449',
	okTint: '#86c39a',
	badTint: '#d08a7c',
	closeTint: '#e2c35c', // Easy typing: right but misspelled (half a point)
	close: '#f5d04e',
	border: 'rgba(9, 14, 19, 0.9)',
	grat: 'rgba(111, 208, 232, 0.08)',
	target: '#6fd0e8',
	ok: '#5fd39a',
	bad: '#ff7a6b',
	hover: 'rgba(255, 250, 238, 0.32)',
	dot: '#101b24',
	ring: '#ecdec2',
	lake: '#1d4560',
	lakeEdge: 'rgba(9, 14, 19, 0.55)',
	river: 'rgba(74, 146, 190, 0.8)',
	label: '#a9dcf3',
	labelHalo: 'rgba(8, 15, 21, 0.82)',
	oceanLabel: 'rgba(169, 220, 243, 0.62)',
	pinEdge: 'rgba(8, 15, 21, 0.85)', // dark outline round an image icon, so it stands off the land
	pinRing: 'rgba(236, 222, 194, 0.9)',
	pinEmpty: 'rgba(10, 15, 20, 0.55)', // the dashed square where the selected country's image will go
};
function sizeCanvases() {
	dpr = Math.min(2, window.devicePixelRatio || 1);
	for (const cv of [mapCv, fxCv, lblCv]) {
		cv.width = Math.round(layout.w * dpr);
		cv.height = Math.round(layout.h * dpr);
	}
}
function invalidate(base = true) {
	if (base) baseDirty = true;
	if (!raf) raf = requestAnimationFrame(frame);
}
function frame(now) {
	raf = 0;
	stepFly(now);
	stepSpin(now);
	if (baseDirty && proj) {
		baseDirty = false;
		drawBase();
	}
	const busy = proj ? drawFx(now) : false;
	if (fly || busy || spin.on) raf = requestAnimationFrame(frame);
}
function viewCap(p) {
	const f = free();
	const half = Math.max(...[[0, 0], [layout.w, 0], [0, layout.h], [layout.w, layout.h]].map(([x, y]) => Math.hypot(x - f.cx, y - f.cy)));
	const s = p.scale();
	if (state.view === 'globe') return half >= s ? Math.PI / 2 : Math.asin(half / s);
	return s * DEG < 8 ? Math.PI * 2 : Math.min(Math.PI, (half / s) * 1.7);
}
function visibleIndices(p) {
	const R = viewCap(p) + 0.02, ctr = [cam.lon, cam.lat];
	if (R >= Math.PI) return META.map((m) => m.i);
	return META.filter((m) => geoDistance(m.c, ctr) - m.r < R).map((m) => m.i);
}
function statusOf(id) {
	if (review) return review.status.get(id) || null;
	if (session && state.mode !== 'study' && state.level === 'easy') return session.result.get(id) || null;
	return null; // Hard: no colours until the end, so each question stands on its own
}
const quiet = () => state.level === 'hard' && state.format === 'click';
const typeEasy = () => state.format === 'type' && state.level === 'easy' && state.mode !== 'study';
function landColor(m) {
	if (!m.country) return COL.territory;
	if (spin.on) return COL.inScope; // the spinning globe shows every country, with no region or results
	if (!inScope(m.country)) return COL.outScope;
	const st = statusOf(m.id);
	return st === 'ok' ? COL.okTint : st === 'bad' ? COL.badTint : st === 'close' ? COL.closeTint : COL.inScope;
}
function drawBase() {
	const t0 = performance.now(), p = proj, ctx = bctx;
	const path = geoPath(p, ctx);
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, layout.w, layout.h);
	const globe = state.view === 'globe';
	const [cx, cy] = p.translate(), R = p.scale();
	// The sea's edge and the grid are a few long curves (a meridian is only 3 points), so let d3
	// add points along them; the land is already dense and stays fast with resampling off.
	p.precision(0.5);
	// sea
	ctx.beginPath();
	path(SPHERE);
	if (globe) {
		const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.05, cx, cy, R);
		g.addColorStop(0, '#1a3142');
		g.addColorStop(1, '#0b1820');
		ctx.fillStyle = g;
	} else ctx.fillStyle = '#10202b';
	ctx.fill();
	if (globe) {
		// a thin atmosphere around the globe
		const g = ctx.createRadialGradient(cx, cy, R * 0.985, cx, cy, R * 1.07);
		g.addColorStop(0, 'rgba(111, 208, 232, 0.28)');
		g.addColorStop(1, 'rgba(111, 208, 232, 0)');
		ctx.beginPath();
		ctx.arc(cx, cy, R * 1.07, 0, TAU);
		ctx.arc(cx, cy, R * 0.985, 0, TAU, true);
		ctx.fillStyle = g;
		ctx.fill();
	}
	ctx.beginPath();
	path(GRAT);
	ctx.strokeStyle = COL.grat;
	ctx.lineWidth = 0.6;
	ctx.stroke();
	p.precision(0);
	// land: each country filled on its own (one big combined path is several times slower to fill
	// on the flat map); the dark outline doubles as the borders
	const feats = LOD[lodName(p)];
	drawnFeats = feats;
	ctx.lineJoin = 'round';
	ctx.lineWidth = borderWidth(p);
	ctx.strokeStyle = COL.border;
	for (const i of visibleIndices(p)) {
		if (!traceShape(ctx, p, path, feats[i], META[i])) continue;
		ctx.fillStyle = landColor(META[i]);
		ctx.fill();
		ctx.stroke();
	}
	drawWater(ctx, path, p);
	if (globe) {
		// shade toward the rim so it reads as a ball
		const g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.35, cx, cy, R);
		g.addColorStop(0, 'rgba(4, 8, 12, 0)');
		g.addColorStop(1, 'rgba(4, 8, 12, 0.5)');
		ctx.beginPath();
		ctx.arc(cx, cy, R, 0, TAU);
		ctx.fillStyle = g;
		ctx.fill();
	}
	if (moving) {
		const ms = performance.now() - t0;
		if (ms > 24) slowDevice = true;
		else if (ms < 8) slowDevice = false;
	}
	drawWaterLabels(p);
}

/* ---------- shapes at the globe's rim ---------- */
// d3 trims each shape where the globe turns away, and now and then, at one angle, a shape near the
// rim comes out inside out: it fills the whole globe instead of the sliver that shows. That was the
// beige flicker while the globe turned. A drawn shape can't be bigger than the place itself (an
// inside-out one is about the whole globe, many times bigger than even Russia looks), so one near the
// rim that comes out more than twice its size is drawn again trimmed a degree or two inside the rim
// (the same picture: at the rim a degree is less than a tenth of a pixel), or left out of that frame.
// m: what the shape covers on the globe ({ c: centre, r: radius, area }, as in META and the lakes).
const rimCheck = new WeakMap(); // projection -> { area: geoPath for areas, alts: the same view trimmed earlier }
function rimFor(p) {
	let fix = rimCheck.get(p);
	if (!fix) rimCheck.set(p, (fix = { area: geoPath(p), alts: null }));
	return fix;
}
const nearRim = (m) => geoDistance(m.c, [cam.lon, cam.lat]) + m.r > Math.PI / 2 - 0.35;
const tooBig = (areaPath, f, m, p) => areaPath.area(f) > m.area * p.scale() ** 2 * 2 + 50;
function insideOut(p, f, m) {
	return state.view === 'globe' && nearRim(m) && tooBig(rimFor(p).area, f, m, p);
}
// Start a path for a shape (ctx.beginPath() and the outline); false if it's left out of this frame
function traceShape(ctx, p, path, f, m) {
	if (!insideOut(p, f, m)) {
		ctx.beginPath();
		path(f);
		return true;
	}
	const fix = rimFor(p);
	if (!fix.alts) {
		fix.alts = [89, 87.5].map((deg) => {
			const q = geoOrthographic().rotate(p.rotate()).translate(p.translate()).scale(p.scale()).clipAngle(deg).precision(0);
			return { draw: geoPath(q), area: geoPath(q) };
		});
	}
	for (const alt of fix.alts) {
		if (tooBig(alt.area, f, m, p)) continue;
		ctx.beginPath();
		alt.draw.context(ctx)(f);
		return true;
	}
	return false;
}

/* ---------- rivers and lakes ---------- */
// Natural Earth's big lakes and major rivers (data/water-low and water-high, built by
// scripts/build-capital-atlas-water.mjs), drawn over the land by zoom level and labelled where
// there's room. A click on one names it instead of counting as the country underneath.
const WATER = { low: null, high: null };
let waterHighRequested = false;
function useWater(t) {
	const prep = (f) => {
		const c = geoCentroid(f);
		let r = 0;
		eachPoint(f.geometry, (pt) => {
			r = Math.max(r, geoDistance(c, pt));
		});
		f.c = c;
		f.r = r + 0.005;
		f.area = geoArea(f);
		return f;
	};
	return { lakes: feature(t, t.objects.lakes).features.map(prep), rivers: feature(t, t.objects.rivers).features.map(prep) };
}
// seas and oceans: just names and places to put them (data/seas.json), biggest first
let SEAS = null;
function loadSeas() {
	return window.__offlineFetchCap(DATA + 'seas.json')
		.then((r) => r.json())
		.then((list) => {
			SEAS = list.sort((a, b) => a.r - b.r);
			invalidate();
		});
}
function loadWater(name) {
	return window.__offlineFetchCap(`${DATA}water-${name}.json`)
		.then((r) => r.json())
		.then((t) => {
			WATER[name] = useWater(t);
			invalidate();
		});
}
// Natural Earth gives each lake and river the web-map zoom it shows from (zoom 0 = the world in 256 px)
const webZoom = (p) => Math.log2((p.scale() * DEG * 360) / 256);
function waterSet(p) {
	if (webZoom(p) >= 4.6) {
		if (!WATER.high && !waterHighRequested) {
			waterHighRequested = true;
			loadWater('high').catch(() => {
				waterHighRequested = false;
			});
		}
		if (WATER.high && !(moving && slowDevice)) return WATER.high;
	}
	return WATER.low;
}
// lakes show from half a zoom level early, rivers a little less; no labels on the whole-world view
const LAKE_LEAD = 0.5, RIVER_LEAD = 0.3, LABEL_MIN_ZOOM = 3;
function visibleWater(list, p, z, lead) {
	const R = viewCap(p) + 0.02, ctr = [cam.lon, cam.lat];
	return list.filter((f) => f.properties.mz <= z + lead && (R >= Math.PI || geoDistance(f.c, ctr) - f.r < R));
}
// borders get thicker as you zoom in; rivers stay thinner than them so borders read first
const borderWidth = (p) => Math.min(1.2, 0.45 + p.scale() * DEG * 0.01);
function riverWidth(rank, p) {
	return Math.max(0.45, borderWidth(p) * (rank <= 2 ? 0.75 : rank <= 4 ? 0.6 : 0.5));
}
const RIVER_CLASSES = [[0, 2], [3, 4], [5, 99]];
// near: only the water close to some countries (redrawing it over a highlighted country)
function drawWater(ctx, path, p, near) {
	const w = waterSet(p);
	if (!w) return;
	const z = webZoom(p);
	const lakes = visibleWater(w.lakes, p, z, LAKE_LEAD).filter((f) => !near || near(f));
	if (lakes.length) {
		ctx.beginPath();
		for (const f of lakes) if (!insideOut(p, f, f)) path(f);
		ctx.fillStyle = COL.lake;
		ctx.fill();
		ctx.lineWidth = 0.6;
		ctx.strokeStyle = COL.lakeEdge;
		ctx.stroke();
	}
	if (moving && slowDevice) return; // rivers come back when the map stops
	const rivers = visibleWater(w.rivers, p, z, RIVER_LEAD).filter((f) => !near || near(f));
	ctx.lineCap = 'round';
	ctx.strokeStyle = COL.river;
	for (const [lo, hi] of RIVER_CLASSES) {
		ctx.beginPath();
		let any = false;
		for (const f of rivers) {
			if (f.properties.r < lo || f.properties.r > hi) continue;
			path(f);
			any = true;
		}
		if (!any) continue;
		ctx.lineWidth = riverWidth(lo, p);
		ctx.stroke();
	}
	ctx.lineCap = 'butt';
}
// Labels go on their own canvas above the highlights, so a lit-up country never hides them.
// They're placed biggest first, skipped where they'd overlap a capital or another label,
// and left off while the map moves.
let labelFont = '';
function drawWaterLabels(p) {
	const ctx = lctx;
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, layout.w, layout.h);
	const w = waterSet(p), z = webZoom(p);
	if (!w || moving || !state.names) return;
	if (!labelFont) labelFont = getComputedStyle(document.body).fontFamily;
	const f = free();
	const taken = [];
	for (const c of COUNTRIES) {
		if (!inScope(c)) continue;
		const pt = projectPoint(p, [c.lon, c.lat]);
		if (pt) taken.push([pt[0] - 9, pt[1] - 9, pt[0] + 9, pt[1] + 9]);
	}
	if (state.pins) {
		const half = PIN_SIZES[state.pinSize] / 2 + 3;
		for (const s of pinSpots(p)) taken.push([s.x - half, s.y - half, s.x + half, s.y + half]);
	}
	const fits = (b) =>
		b[0] >= f.x0 + 4 && b[2] <= f.x1 - 4 && b[1] >= f.y0 + 4 && b[3] <= f.y1 - 4 &&
		!taken.some((t) => b[0] < t[2] && b[2] > t[0] && b[1] < t[3] && b[3] > t[1]);
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.lineJoin = 'round';
	const place = (text, points, size, ocean) => {
		ctx.font = `italic ${ocean ? 600 : 500} ${size}px ${labelFont}`;
		if ('letterSpacing' in ctx) ctx.letterSpacing = ocean ? '2px' : '0px';
		const half = ctx.measureText(text).width / 2 + 2, h = size / 2 + 2;
		for (const ll of points) {
			const pt = projectPoint(p, ll);
			if (!pt) continue;
			const b = [pt[0] - half, pt[1] - h, pt[0] + half, pt[1] + h];
			if (!fits(b)) continue;
			taken.push(b);
			ctx.lineWidth = 3;
			ctx.strokeStyle = COL.labelHalo;
			ctx.strokeText(text, pt[0], pt[1]);
			ctx.fillStyle = ocean ? COL.oceanLabel : COL.label;
			ctx.fillText(text, pt[0], pt[1]);
			return true;
		}
		return false;
	};
	let n = 0;
	// oceans and seas first (they sit in open water): the spot nearest the middle of the view that fits
	if (SEAS) {
		const ctr = [cam.lon, cam.lat];
		for (const s of SEAS) {
			const ocean = s.k === 'ocean';
			if (ocean ? z < 1 : z < s.ml - 0.2) continue;
			const pts = s.lp.slice().sort((a, b) => geoDistance(a, ctr) - geoDistance(b, ctr));
			const name = waterName(s.n);
			if (n < 80 && place(ocean ? name.toLocaleUpperCase(locale()) : name, pts, ocean ? 13 : s.r <= 1 ? 12 : 11, ocean)) n++;
		}
		if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
	}
	if (z < LABEL_MIN_ZOOM) return; // lakes and rivers: not on the whole-world view
	const lakes = visibleWater(w.lakes, p, z, LAKE_LEAD)
		.filter((l) => l.properties.n && l.properties.ml <= z + RIVER_LEAD)
		.sort((a, b) => a.properties.r - b.properties.r || b.area - a.area);
	for (const l of lakes) if (n < 40 && place(waterName(l.properties.n), [l.properties.lp], l.properties.r <= 1 ? 12 : 11)) n++;
	// a river is several pieces: one label per name, on the first of its points that fits
	const byName = new Map();
	for (const r of visibleWater(w.rivers, p, z, RIVER_LEAD)) {
		const q = r.properties;
		if (!q.n || q.ml > z + RIVER_LEAD) continue;
		const g = byName.get(q.n) || { r: q.r, points: [] };
		g.r = Math.min(g.r, q.r);
		g.points.push(...q.lp);
		byName.set(q.n, g);
	}
	for (const [name, g] of [...byName].sort((a, b) => a[1].r - b[1].r)) if (n < 70 && place(waterName(name), g.points, 11)) n++;
}
// The lake under the pointer, if one is on screen: { text } for the message. Lakes can be clicked
// and don't count as the country around them; rivers are too thin for that, so a click or hover
// on a river goes to the country under it.
function waterAt(x, y) {
	const p = proj, w = p && waterSet(p);
	if (!w) return null;
	const ll = p.invert([x, y]);
	if (!ll || !isFinite(ll[0]) || !isFinite(ll[1])) return null;
	if (state.view === 'globe' && geoDistance(ll, [cam.lon, cam.lat]) >= Math.PI / 2) return null;
	const z = webZoom(p);
	for (const f of w.lakes) {
		const q = f.properties;
		if (q.mz <= z + LAKE_LEAD && geoDistance(f.c, ll) < f.r && geoContains(f, ll)) return { text: q.n ? t('lake_is', { name: waterName(q.n) }) : t('a_lake') };
	}
	return null;
}

/* ---------- overlay: capital dots, small-country rings, highlights ---------- */
const RING = 8;
const screen = new Map(); // id -> { x, y, tiny } for in-scope countries on screen, rebuilt each overlay draw
let hoverId = null, hoverIdx = null;
let flashes = []; // { id, kind: 'ok' | 'bad' | 'reveal', t0 }
let callout = null; // { id, title, sub }
const canHover = window.matchMedia('(hover: hover)').matches;
function projectPoint(p, ll) {
	if (state.view === 'globe' && geoDistance(ll, [cam.lon, cam.lat]) > Math.PI / 2 - 0.004) return null;
	const pt = p(ll);
	return pt && isFinite(pt[0]) ? pt : null;
}
const isTiny = (m, p) => m.small && m.area * p.scale() * p.scale() < 250;
function targetId() {
	if (state.mode === 'study') return studySelected() ? study.items[study.index].id : null;
	if (!session || !session.current || review) return null;
	if (session.phase === 'reveal' || (state.format === 'type' && S.lightTyped)) return session.current.id;
	return null;
}
function fillCountry(ctx, path, id, fill, alpha, stroke) {
	const c = BY_ID.get(id);
	if (!c) return;
	const s = screen.get(id);
	ctx.globalAlpha = alpha;
	ctx.fillStyle = fill;
	if (s && s.tiny) {
		ctx.beginPath();
		ctx.arc(s.x, s.y, RING, 0, TAU);
		ctx.fill();
	} else if (traceShape(ctx, proj, path, (moving && drawnFeats ? drawnFeats : bestFeats())[c.fi], META[c.fi])) {
		ctx.fill();
		if (stroke) {
			ctx.globalAlpha = 1;
			ctx.lineWidth = 1.6;
			ctx.strokeStyle = stroke;
			ctx.stroke();
		}
	}
	ctx.globalAlpha = 1;
}
function drawFx(now) {
	const ctx = fctx, p = proj, path = geoPath(p, ctx);
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, layout.w, layout.h);
	let busy = false;
	// where each in-scope capital is on screen, and which countries are too small to click
	screen.clear();
	if (spin.on) {
		pinRects = [];
		drawSpinFx(ctx, p, now);
		return true;
	}
	for (const c of COUNTRIES) {
		if (!inScope(c) || c.fi == null) continue;
		const pt = projectPoint(p, [c.lon, c.lat]);
		if (pt) screen.set(c.id, { x: pt[0], y: pt[1], tiny: isTiny(META[c.fi], p) });
	}
	// hover
	if (hoverIdx != null && canHover && !moving) {
		const s = hoverId && screen.get(hoverId);
		let drawn = true;
		if (s && s.tiny) {
			ctx.beginPath();
			ctx.arc(s.x, s.y, RING, 0, TAU);
		} else drawn = traceShape(ctx, p, path, bestFeats()[hoverIdx], META[hoverIdx]);
		ctx.fillStyle = COL.hover;
		if (drawn) ctx.fill();
	}
	// answer flashes fade out
	flashes = flashes.filter((fl) => now - fl.t0 < 900);
	for (const fl of flashes) {
		busy = true;
		const a = 1 - (now - fl.t0) / 900;
		fillCountry(ctx, path, fl.id, fl.kind === 'reveal' ? COL.target : COL[fl.kind], 0.85 * a);
	}
	// the country being studied or asked about
	const tid = targetId();
	if (tid) {
		const pulse = session && (session.phase === 'reveal' || (state.format === 'type' && S.lightTyped)) && state.mode !== 'study';
		const a = pulse ? 0.55 + 0.3 * Math.sin(now / 260) : 0.78;
		if (pulse) busy = true;
		ctx.shadowColor = 'rgba(111, 208, 232, 0.8)';
		ctx.shadowBlur = 14;
		fillCountry(ctx, path, tid, COL.target, a, '#bff0fb');
		ctx.shadowBlur = 0;
	}
	// lakes and rivers back on top of any lit-up country (the water isn't part of it)
	const lit = [];
	const light = (id) => {
		const c = id && BY_ID.get(id);
		if (c && c.fi != null) lit.push(META[c.fi]);
	};
	if (hoverIdx != null && canHover && !moving) lit.push(META[hoverIdx]);
	for (const fl of flashes) light(fl.id);
	light(tid);
	if (lit.length) drawWater(ctx, path, p, (f) => lit.some((m) => geoDistance(m.c, f.c) < m.r + f.r));
	// rings around countries too small to see, then every capital (World Capitals only)
	for (const [id, s] of screen) {
		if (!s.tiny) continue;
		ctx.beginPath();
		ctx.arc(s.x, s.y, RING, 0, TAU);
		ctx.fillStyle = 'rgba(236, 222, 194, 0.16)';
		ctx.fill();
		ctx.lineWidth = 1.3;
		ctx.strokeStyle = statusRingColor(id);
		ctx.stroke();
	}
	const r = Math.min(3.6, 2.2 + p.scale() * DEG * 0.004);
	for (const [, s] of S.dots ? screen : []) {
		ctx.beginPath();
		ctx.arc(s.x, s.y, r, 0, TAU);
		ctx.fillStyle = COL.dot;
		ctx.fill();
		ctx.lineWidth = 1.2;
		ctx.strokeStyle = COL.ring;
		ctx.stroke();
	}
	if (state.pins) drawPins(ctx, p, tid);
	else pinRects = [];
	placeCallout(p);
	return busy;
}
function statusRingColor(id) {
	const st = statusOf(id);
	return st === 'ok' ? COL.ok : st === 'bad' ? COL.bad : st === 'close' ? COL.close : COL.ring;
}
function flash(id, kind) {
	// Hard clicking: a click still flashes green or red and fades back, but a missed country's
	// location stays hidden, and nothing stays coloured until the end
	if (quiet() && !review && kind === 'reveal') return;
	flashes.push({ id, kind, t0: performance.now() });
	invalidate(false);
}

/* ---------- name callout pinned to a capital ---------- */
// World Flags: a country's flag, as a picture
function flagImg(id) {
	const img = document.createElement('img');
	img.className = 'flag';
	img.src = flagUrl(id);
	img.alt = '';
	img.decoding = 'async';
	return img;
}
const calloutFor = (c) => {
	const k = S.callout(c);
	setCallout(c.id, k.title, k.sub, k.flag);
};
function setCallout(id, title, sub, flag) {
	callout = id ? { id, title, sub } : null;
	const el = $('callout');
	if (!callout) {
		el.hidden = true;
		$('leader').style.display = 'none';
		return;
	}
	el.replaceChildren(document.createTextNode(title));
	if (flag) el.prepend(flagImg(flag));
	if (sub) {
		const s = document.createElement('small');
		s.textContent = sub;
		el.append(s);
	}
	invalidate(false);
}
function placeCallout(p) {
	const el = $('callout'), line = $('leaderLine');
	if (!callout) return;
	const c = BY_ID.get(callout.id);
	const pt = c && projectPoint(p, [c.lon, c.lat]);
	if (!pt) {
		el.hidden = true;
		$('leader').style.display = 'none';
		return;
	}
	el.hidden = false;
	$('leader').style.display = '';
	const f = free(), bw = el.offsetWidth, bh = el.offsetHeight;
	let x = pt[0] + 22, y = pt[1] - bh - 18;
	if (x + bw > f.x1 - 6) x = pt[0] - 22 - bw;
	if (y < f.y0 + 4) y = pt[1] + 18;
	// Images mode: keep the label off the country's own picture (the first corner that fits and is clear)
	const pinPt = state.pins && c.fi != null && projectPoint(p, iconLL(c));
	if (pinPt) {
		const h = PIN_SIZES[state.pinSize] / 2 + 6;
		const clear = ([cx, cy]) => cx > pinPt[0] + h || cx + bw < pinPt[0] - h || cy > pinPt[1] + h || cy + bh < pinPt[1] - h;
		const fits = ([cx, cy]) => cx >= f.x0 + 4 && cx + bw <= f.x1 - 6 && cy >= f.y0 + 4 && cy + bh <= f.y1 - 4;
		const spots = [[pt[0] + 22, pt[1] - bh - 18], [pt[0] - 22 - bw, pt[1] - bh - 18], [pt[0] + 22, pt[1] + 18], [pt[0] - 22 - bw, pt[1] + 18]];
		const pick = spots.find((s) => fits(s) && clear(s));
		if (pick) [x, y] = pick;
	}
	el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
	const ex = x > pt[0] ? x : x + bw, ey = y > pt[1] ? y : y + bh;
	line.setAttribute('x1', pt[0]);
	line.setAttribute('y1', pt[1]);
	line.setAttribute('x2', ex);
	line.setAttribute('y2', ey);
}

/* ---------------- picking ---------------- */
function pickAt(x, y) {
	let best = null, bd = Infinity;
	// 0. Images mode: a picture belongs to its country, even where it hangs over a neighbour (the top one wins)
	for (let k = pinRects.length - 1; k >= 0; k--) {
		const r = pinRects[k];
		if (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1) return { id: r.id, i: BY_ID.get(r.id).fi };
	}
	// 1. right on a capital dot: that capital's country (Jerusalem sits on the West Bank border, Rome next to the Vatican)
	for (const [id, s] of screen) {
		const d = Math.hypot(s.x - x, s.y - y);
		if (d <= 5 && d < bd) {
			bd = d;
			best = id;
		}
	}
	if (best) return { id: best, i: BY_ID.get(best).fi };
	// 2. a ring around a small country
	for (const [id, s] of screen) {
		if (!s.tiny) continue;
		const d = Math.hypot(s.x - x, s.y - y);
		if (d <= RING + 4 && d < bd) {
			bd = d;
			best = id;
		}
	}
	if (best) return { id: best, i: BY_ID.get(best).fi };
	// 3. a lake: it gets named, and doesn't count as the country around it
	const water = waterAt(x, y);
	if (water) return { water };
	// 4. the land under the pointer
	const ll = proj.invert([x, y]);
	if (ll && isFinite(ll[0]) && isFinite(ll[1]) && (state.view === 'map' || geoDistance(ll, [cam.lon, cam.lat]) < Math.PI / 2)) {
		const feats = bestFeats();
		for (const m of META) if (inBox(m.box, ll) && geoContains(feats[m.i], ll)) return { id: m.id, i: m.i };
	}
	// 5. close to a capital dot (islands too small to hit, but not small enough for a ring)
	for (const [id, s] of screen) {
		const d = Math.hypot(s.x - x, s.y - y);
		if (d <= 10 && d < bd) {
			bd = d;
			best = id;
		}
	}
	return best ? { id: best, i: BY_ID.get(best).fi } : null;
}

/* ---------------- pointer and wheel ---------------- */
const pointers = new Map();
let drag = null;
function localXY(e) {
	const r = mapCv.getBoundingClientRect();
	return [e.clientX - r.left, e.clientY - r.top];
}
mapCv.addEventListener('pointerdown', (e) => {
	mapCv.setPointerCapture(e.pointerId);
	const [x, y] = localXY(e);
	pointers.set(e.pointerId, { x, y });
	if (pointers.size === 1) drag = { x0: x, y0: y, x, y, moved: false };
	else drag && (drag.moved = true);
	cancelFly();
});
mapCv.addEventListener('pointermove', (e) => {
	const [x, y] = localXY(e);
	const prev = pointers.get(e.pointerId);
	if (!prev) {
		hoverAt(x, y);
		return;
	}
	if (pointers.size >= 2) {
		// pinch: zoom around the midpoint and pan with it
		const pts = [...pointers.values()];
		const other = pts.find((q) => q !== prev);
		const d0 = Math.hypot(prev.x - other.x, prev.y - other.y), d1 = Math.hypot(x - other.x, y - other.y);
		prev.x = x;
		prev.y = y;
		if (d0 > 0 && d1 > 0) zoomAround((x + other.x) / 2, (y + other.y) / 2, d1 / d0);
		return;
	}
	const dx = x - prev.x, dy = y - prev.y;
	prev.x = x;
	prev.y = y;
	if (!drag) return;
	if (!drag.moved && Math.hypot(x - drag.x0, y - drag.y0) < 5) return;
	drag.moved = true;
	$('stage').classList.add('dragging');
	panBy(dx, dy, x, y);
});
function panBy(dx, dy, x, y) {
	const s = proj.scale();
	if (state.view === 'globe') {
		cam.lon -= dx / (s * DEG);
		cam.lat += dy / (s * DEG);
	} else {
		const a = proj.invert([x - dx, y - dy]), b = proj.invert([x, y]);
		if (a && b && isFinite(a[0]) && isFinite(b[0])) {
			cam.lon += a[0] - b[0];
			cam.lat += a[1] - b[1];
		}
	}
	constrain();
	updateProj();
	state.zoomArea = null;
	renderZoom();
	interacting();
	settle();
	invalidate();
}
function endPointer(e) {
	const [x, y] = localXY(e);
	const wasDrag = drag && drag.moved;
	pointers.delete(e.pointerId);
	if (pointers.size === 0) {
		$('stage').classList.remove('dragging');
		if (drag && !wasDrag && e.type === 'pointerup' && !spin.on) onMapClick(pickAt(x, y)); // the spinning globe is only for looking at
		drag = null;
	}
}
mapCv.addEventListener('pointerup', endPointer);
mapCv.addEventListener('pointercancel', endPointer);
mapCv.addEventListener('pointerleave', () => {
	if (!pointers.size) setHover(null);
});
mapCv.addEventListener(
	'wheel',
	(e) => {
		e.preventDefault();
		const [x, y] = localXY(e);
		const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
		zoomAround(x, y, Math.exp(-dy * 0.0016));
	},
	{ passive: false },
);
let hoverRaf = 0;
function hoverAt(x, y) {
	if (!canHover || !proj || spin.on) return;
	cancelAnimationFrame(hoverRaf);
	hoverRaf = requestAnimationFrame(() => {
		const hit = pickAt(x, y);
		setHover(hit);
	});
}
function setHover(hit) {
	const idx = hit && hit.i != null ? hit.i : null;
	if (idx === hoverIdx) return;
	hoverIdx = idx;
	hoverId = hit ? hit.id : null;
	$('stage').classList.toggle('hovering', idx != null);
	invalidate(false);
}

/* ---------------- study mode ---------------- */
let study = null;
function startStudy(selectId) {
	const items = scopeCountries().sort((a, b) => nameOf(a).localeCompare(nameOf(b), locale())); // A to Z in the language in use
	const at = items.findIndex((c) => c.id === selectId);
	study = { items, index: Math.max(0, at), cleared: false };
	showStudyItem(false);
}
function showStudyItem(move) {
	if (!study || !study.items.length) {
		setCallout(null);
		renderPrompt();
		return;
	}
	study.cleared = false;
	const c = study.items[study.index];
	calloutFor(c);
	if (move) showCountry(c, false);
	renderPrompt();
	invalidate(false);
}
function studyStep(d) {
	if (state.mode !== 'study' || !study || !study.items.length) return;
	// after Esc, → brings back the country you were on (and ← goes to the one before it)
	if (study.cleared && d > 0) d = 0;
	study.index = (study.index + d + study.items.length) % study.items.length;
	showStudyItem(true);
}
// Esc in Study (as in the 3D atlases): nothing is selected, the prompt shows the region, and the
// arrows pick up where you were
function clearStudySelection() {
	study.cleared = true;
	setCallout(null);
	renderPrompt();
	invalidate(false);
}
const studySelected = () => state.mode === 'study' && !!study && study.items.length > 0 && !study.cleared;
function studyPick(hit) {
	if (!hit) return;
	if (!hit.id) return toastPlace(hit.i);
	const c = BY_ID.get(hit.id);
	const at = study ? study.items.findIndex((x) => x.id === c.id) : -1;
	if (at < 0) {
		toast(S.outside(c, regionLabel()));
		return;
	}
	study.index = at;
	showStudyItem(false);
}
function toastPlace(i) {
	const m = META[i];
	const name = placeName(m.name), of = m.of && m.of !== m.name ? placeName(m.of) : null;
	toast(t('not_country', { name: of ? t('place_of', { name, of }) : name }));
}
// Bring a country into view if it isn't comfortably visible (always, for typed questions)
function showCountry(c, forTyping) {
	const m = META[c.fi], f = free();
	const pt = projectPoint(proj, [c.lon, c.lat]);
	const area = m.area * proj.scale() ** 2;
	const inside = pt && pt[0] > f.x0 + 40 && pt[0] < f.x1 - 40 && pt[1] > f.y0 + 40 && pt[1] < f.y1 - 40;
	if (inside && (!forTyping || (area > 500 && area < f.fw * f.fh * 0.6))) return;
	state.zoomArea = null;
	renderZoom();
	flyTo(camForCountry(c));
}

/* ---------------- image mode (hidden) ---------------- */
// Study with picture hooks: pick a country, paste an image (from Google Images, say) and it's pinned
// to the middle of that country as a small square icon, the same size for every country. Turn it on
// with I or #images; the Mode bar shows "Images" while it's on. Pictures are cropped to a square,
// shrunk, and saved in this browser only (IndexedDB: too big for localStorage). Nothing is uploaded.
const PIN_SIZES = [28, 36, 44, 56, 72]; // icon sizes on screen, in CSS pixels
const PIN_PX = 160; // saved pictures: a square this many pixels a side (sharp up to the biggest icon on a 2x screen)
const PIN_BG = '#ffffff'; // behind see-through parts of a picture (a PNG cut-out sits on white, like on most image sites)
const PINS = new Map(); // country id -> { img, tile } (tile: the icon pre-drawn at the current size)
const PASTE_KEY = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '') ? '⌘V' : 'Ctrl+V';
let pinRects = []; // where each icon was drawn last, for clicks: { id, x0, y0, x1, y1 }, top one last

const pinDb = (() => {
	let opening = null;
	const open = () =>
		opening ||
		(opening = new Promise((resolve, reject) => {
			if (!window.indexedDB) return reject(new Error('no IndexedDB'));
			const rq = indexedDB.open('ss1.' + S.tool, 1);
			rq.onupgradeneeded = () => rq.result.createObjectStore('images');
			rq.onsuccess = () => resolve(rq.result);
			rq.onerror = () => reject(rq.error);
		}).catch((err) => {
			opening = null;
			throw err;
		}));
	const run = (mode, fn) =>
		open().then(
			(db) =>
				new Promise((resolve, reject) => {
					const tx = db.transaction('images', mode);
					const out = fn(tx.objectStore('images'));
					tx.oncomplete = () => resolve(out);
					tx.onerror = tx.onabort = () => reject(tx.error);
				}),
		);
	return {
		all: () =>
			run('readonly', (st) => {
				const rows = [];
				st.openCursor().onsuccess = (e) => {
					const cur = e.target.result;
					if (!cur) return;
					rows.push([cur.key, cur.value]);
					cur.continue();
				};
				return rows;
			}),
		put: (id, blob) => run('readwrite', (st) => st.put(blob, id)),
		del: (id) => run('readwrite', (st) => st.delete(id)),
	};
})();

function blobImage(blob) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(blob);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('not an image'));
		};
		img.src = url;
	});
}
// An image from a web address (dragged in, or an <img> in pasted HTML). Most sites don't allow
// reading their pictures from another site, so this often fails; copying the image itself works.
function urlImage(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		if (!/^data:/i.test(url)) img.crossOrigin = 'anonymous';
		img.referrerPolicy = 'no-referrer';
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('not an image'));
		img.src = url;
	});
}
// The middle square of a picture, shrunk to PIN_PX and saved as WebP (JPEG where WebP can't be written)
function squareBlob(img) {
	const w = img.naturalWidth || img.width || 300, h = img.naturalHeight || img.height || 300;
	const side = Math.min(w, h);
	// halve in steps on the way down, so big photos stay smooth instead of grainy
	let cv = document.createElement('canvas'), size = side;
	while (size / 2 >= PIN_PX * 1.5) size = Math.round(size / 2);
	cv.width = cv.height = Math.max(PIN_PX, size);
	let ctx = cv.getContext('2d');
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, cv.width, cv.height);
	while (cv.width / 2 >= PIN_PX) {
		const half = document.createElement('canvas');
		half.width = half.height = Math.round(cv.width / 2);
		const hc = half.getContext('2d');
		hc.imageSmoothingQuality = 'high';
		hc.drawImage(cv, 0, 0, half.width, half.height);
		cv = half;
	}
	const out = document.createElement('canvas');
	out.width = out.height = PIN_PX;
	ctx = out.getContext('2d');
	ctx.fillStyle = PIN_BG;
	ctx.fillRect(0, 0, PIN_PX, PIN_PX);
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(cv, 0, 0, PIN_PX, PIN_PX);
	const encode = (type, q) => new Promise((resolve) => out.toBlob(resolve, type, q));
	return encode('image/webp', 0.86).then((b) => (b && b.type === 'image/webp' ? b : encode('image/jpeg', 0.88)));
}
// The picture in a paste or a drop: an image file first, then an <img> in copied HTML, then a link
function imageFromTransfer(dt) {
	if (!dt) return null;
	let file = [...(dt.files || [])].find((f) => /^image\//.test(f.type));
	if (!file) for (const it of dt.items || []) if (!file && it.kind === 'file' && /^image\//.test(it.type)) file = it.getAsFile();
	if (file) return blobImage(file);
	const html = dt.getData('text/html') || '';
	const m = html.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
	const link = (s) => String(s || '').split(/\r?\n/).map((l) => l.trim()).find((l) => /^(https?:|data:image\/)/i.test(l));
	const url = (m && m[1].replace(/&amp;/g, '&')) || link(dt.getData('text/uri-list')) || link(dt.getData('text/plain'));
	return url ? urlImage(url) : null;
}

let pinsLoading = null;
function loadPins() {
	if (!pinsLoading) {
		pinsLoading = pinDb
			.all()
			.then(async (rows) => {
				for (const [id, blob] of rows) {
					if (!BY_ID.has(id) || PINS.has(id)) continue;
					try {
						PINS.set(id, { img: await blobImage(blob), tile: null });
					} catch (e) {
						/* an unreadable picture: leave it out */
					}
				}
			})
			.catch(() => {})
			.then(() => {
				renderPrompt();
				invalidate();
			});
	}
	return pinsLoading;
}
const selectedPinId = () => (state.pins && studySelected() ? study.items[study.index].id : null);
// Pin a picture (a promise of a loaded <img>) to a country: the one selected when the paste or drop happened
async function pinPicture(source, id = selectedPinId()) {
	const c = id && BY_ID.get(id);
	if (!c || !source) {
		if (source) source.catch(() => {});
		toast(c ? 'That wasn’t an image.' : 'Pick a country first.', 'bad');
		return;
	}
	let blob, img;
	try {
		blob = await squareBlob(await source);
		img = await blobImage(blob);
	} catch (err) {
		toast('Couldn’t use that image. On Google Images, right-click the picture, choose Copy image, then paste.', 'bad');
		return;
	}
	const replaced = PINS.has(c.id);
	PINS.set(c.id, { img, tile: null });
	toast(replaced ? `New image for ${nameOf(c)}.` : `Image pinned to ${nameOf(c)}.`, 'ok');
	pinDb.put(c.id, blob).catch(() => toast('This browser won’t save images (a private window?), so it’ll be gone after a reload.', 'bad'));
	renderPrompt();
	invalidate();
}
function removePin(id = selectedPinId()) {
	if (!id || !PINS.has(id)) return;
	PINS.delete(id);
	pinDb.del(id).catch(() => {});
	toast(`Image removed from ${nameOf(BY_ID.get(id))}.`);
	renderPrompt();
	invalidate();
}
async function pasteFromButton() {
	const id = selectedPinId();
	if (!id) return toast('Pick a country first.', 'bad');
	if (!navigator.clipboard || !navigator.clipboard.read) return toast(`Copy an image, then press ${PASTE_KEY} here.`);
	let items;
	try {
		items = await navigator.clipboard.read();
	} catch (err) {
		return toast(`The browser didn’t let this page read the clipboard. Press ${PASTE_KEY} instead.`, 'bad');
	}
	for (const it of items) {
		const type = it.types.find((t) => /^image\//.test(t));
		if (type) return pinPicture(it.getType(type).then(blobImage), id);
	}
	for (const it of items) {
		if (!it.types.includes('text/html')) continue;
		const m = (await (await it.getType('text/html')).text()).match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
		if (m) return pinPicture(urlImage(m[1].replace(/&amp;/g, '&')), id);
	}
	toast('There’s no image on the clipboard. Right-click a picture and choose Copy image first.', 'bad');
}
function setPins(on) {
	if (on === state.pins) return;
	const go = () => {
		state.pins = on;
		store.set('imageMode', on);
		if (on) {
			loadPins();
			if (state.mode !== 'study') setMode('study');
			else renderAll();
			toast(narrow() ? 'Images: tap a country, then paste or upload a picture for it.' : `Images: pick a country, then paste a picture onto it (${PASTE_KEY}). Press I to leave.`);
		} else {
			renderAll();
			toast('Images off.');
		}
	};
	if (on) guardTest('Switching to Images', go);
	else go();
}
function setPinSize(d) {
	const n = Math.min(PIN_SIZES.length - 1, Math.max(0, state.pinSize + d));
	if (n === state.pinSize) return;
	state.pinSize = n;
	store.set('imageSize', n);
	renderPinBar();
	invalidate();
}
// The buttons under the prompt card (not in the clean recording view: Ctrl+V still works there)
function renderPinBar() {
	const id = selectedPinId();
	$('pinBar').hidden = !id || state.clean;
	$('pinRemove').hidden = !(id && PINS.has(id));
	$('pinSmaller').disabled = state.pinSize === 0;
	$('pinBigger').disabled = state.pinSize === PIN_SIZES.length - 1;
}
$('pinPaste').addEventListener('click', pasteFromButton);
$('pinUpload').addEventListener('click', () => $('pinFile').click());
$('pinFile').addEventListener('change', () => {
	const f = $('pinFile').files[0];
	$('pinFile').value = '';
	if (f) pinPicture(blobImage(f));
});
$('pinRemove').addEventListener('click', () => removePin());
$('pinSmaller').addEventListener('click', () => setPinSize(-1));
$('pinBigger').addEventListener('click', () => setPinSize(1));
document.addEventListener('paste', (e) => {
	if (!state.pins || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable || pendingConfirm) return;
	const source = imageFromTransfer(e.clipboardData);
	e.preventDefault();
	if (!source) return toast('There’s no image on the clipboard. Right-click a picture and choose Copy image first.', 'bad');
	pinPicture(source);
});
// Drag a picture onto a country (from your computer, or from another page where the site allows it)
window.addEventListener('dragover', (e) => {
	if (!state.pins) return;
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
	const [x, y] = localXY(e);
	hoverAt(x, y);
});
window.addEventListener('drop', (e) => {
	if (!state.pins) return;
	e.preventDefault();
	const [x, y] = localXY(e);
	const hit = proj && pickAt(x, y);
	let id = selectedPinId();
	if (hit && hit.id && study) {
		const at = study.items.findIndex((c) => c.id === hit.id);
		if (at < 0) return toast(`${nameOf(BY_ID.get(hit.id))} is outside ${regionLabel()}.`, 'bad');
		study.index = at;
		showStudyItem(false);
		id = hit.id;
	}
	pinPicture(imageFromTransfer(e.dataTransfer), id);
});

// Where a country's picture goes: the middle of its biggest piece of land (the point farthest from
// any coast or border, so it lands inside even for curved countries like Croatia), or the capital for
// countries too small to see, where their ring is.
const PIN_AT = new Map(); // id -> { feats, ll }
function iconLL(c) {
	const m = META[c.fi];
	if (m.small) return [c.lon, c.lat];
	const feats = LOD.mid || LOD.low || LOD.xlow; // detailed enough, and quick to search
	const known = PIN_AT.get(c.id);
	if (known && known.feats === feats) return known.ll;
	const ll = landMiddle(feats[c.fi].geometry) || [c.lon, c.lat];
	PIN_AT.set(c.id, { feats, ll });
	return ll;
}
function landMiddle(g) {
	const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
	let best = null;
	for (const poly of polys) {
		// flatten around the piece's own latitude, unwrapping pieces that cross the date line
		const lons = poly[0].map((q) => q[0]);
		const wrap = Math.max(...lons) - Math.min(...lons) > 180;
		const lats = poly[0].map((q) => q[1]);
		const k = Math.cos(((Math.min(...lats) + Math.max(...lats)) / 2) * DEG);
		const rings = poly.map((r) => r.map(([lon, lat]) => [(wrap && lon < 0 ? lon + 360 : lon) * k, lat]));
		let a = 0;
		const o = rings[0];
		for (let i = 0, j = o.length - 1; i < o.length; j = i++) a += (o[j][0] - o[i][0]) * (o[j][1] + o[i][1]);
		a = Math.abs(a) / 2;
		if (!best || a > best.a) best = { a, rings, k };
	}
	if (!best || !best.a) return null;
	const [x, y] = farthestInside(best.rings);
	let lon = x / best.k;
	if (lon > 180) lon -= 360;
	return [lon, y];
}
// The "pole of inaccessibility" (Mapbox's polylabel method): split the shape's box into squares,
// keep splitting the ones that could still hold a point farther from the edge than the best so far
function farthestInside(rings) {
	let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
	for (const [x, y] of rings[0]) {
		x0 = Math.min(x0, x);
		y0 = Math.min(y0, y);
		x1 = Math.max(x1, x);
		y1 = Math.max(y1, y);
	}
	const w = x1 - x0, h = y1 - y0, cell = Math.min(w, h);
	if (!cell) return [x0, y0];
	const precision = Math.max(w, h) / 250;
	// distance to the nearest edge, negative outside the shape
	const edgeDist = (px, py) => {
		let inside = false, d2 = Infinity;
		for (const r of rings) {
			for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
				const [ax, ay] = r[i], [bx, by] = r[j];
				if (ay > py !== by > py && px < ((bx - ax) * (py - ay)) / (by - ay) + ax) inside = !inside;
				let dx = bx - ax, dy = by - ay, t = 0;
				if (dx || dy) t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
				dx = ax + t * dx - px;
				dy = ay + t * dy - py;
				d2 = Math.min(d2, dx * dx + dy * dy);
			}
		}
		return (inside ? 1 : -1) * Math.sqrt(d2);
	};
	const mk = (x, y, half) => {
		const d = edgeDist(x, y);
		return { x, y, half, d, max: d + half * Math.SQRT2 };
	};
	// a small max-heap on `max`
	const heap = [];
	const push = (c) => {
		heap.push(c);
		for (let i = heap.length - 1; i > 0; ) {
			const p = (i - 1) >> 1;
			if (heap[p].max >= heap[i].max) break;
			[heap[p], heap[i]] = [heap[i], heap[p]];
			i = p;
		}
	};
	const pop = () => {
		const top = heap[0], last = heap.pop();
		if (heap.length) {
			heap[0] = last;
			for (let i = 0; ; ) {
				const l = 2 * i + 1, r = l + 1;
				let m = i;
				if (l < heap.length && heap[l].max > heap[m].max) m = l;
				if (r < heap.length && heap[r].max > heap[m].max) m = r;
				if (m === i) break;
				[heap[m], heap[i]] = [heap[i], heap[m]];
				i = m;
			}
		}
		return top;
	};
	for (let x = x0; x < x1; x += cell) for (let y = y0; y < y1; y += cell) push(mk(x + cell / 2, y + cell / 2, cell / 2));
	let best = mk(x0 + w / 2, y0 + h / 2, 0);
	for (let n = 0; heap.length && n < 4000; n++) {
		const c = pop();
		if (c.d > best.d) best = c;
		if (c.max - best.d <= precision) continue;
		const q = c.half / 2;
		push(mk(c.x - q, c.y - q, q));
		push(mk(c.x + q, c.y - q, q));
		push(mk(c.x - q, c.y + q, q));
		push(mk(c.x + q, c.y + q, q));
	}
	return [best.x, best.y];
}
// The pictures on screen: countries in the region you're studying that have one
function pinSpots(p) {
	const out = [];
	if (!PINS.size) return out;
	for (const c of COUNTRIES) {
		if (c.fi == null || !PINS.has(c.id) || !inScope(c)) continue;
		const pt = projectPoint(p, iconLL(c));
		if (pt) out.push({ c, x: pt[0], y: pt[1] });
	}
	return out;
}
function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}
// A country's icon, drawn once at the current size (and redrawn when the size changes)
function pinTile(pin, s) {
	const px = Math.round(s * dpr);
	if (pin.tile && pin.tile.px === px) return pin.tile.cv;
	const cv = document.createElement('canvas');
	cv.width = cv.height = px;
	const t = cv.getContext('2d');
	roundRect(t, 0, 0, px, px, px * 0.22);
	t.clip();
	t.imageSmoothingQuality = 'high';
	t.drawImage(pin.img, 0, 0, px, px);
	pin.tile = { px, cv };
	return cv;
}
function drawPins(ctx, p, selId) {
	const s = PIN_SIZES[state.pinSize], half = s / 2, r = s * 0.22;
	const spots = pinSpots(p).sort((a, b) => (a.c.id === selId) - (b.c.id === selId)); // the selected one on top
	pinRects = [];
	for (const { c, x, y } of spots) {
		const x0 = x - half, y0 = y - half;
		ctx.drawImage(pinTile(PINS.get(c.id), s), x0, y0, s, s);
		roundRect(ctx, x0, y0, s, s, r);
		ctx.lineWidth = 3;
		ctx.strokeStyle = COL.pinEdge;
		ctx.stroke();
		ctx.lineWidth = c.id === selId ? 2 : 1.2;
		ctx.strokeStyle = c.id === selId ? COL.target : COL.pinRing;
		ctx.stroke();
		pinRects.push({ id: c.id, x0, y0, x1: x0 + s, y1: y0 + s });
	}
	// the selected country without a picture yet: a dashed square where one will go
	const c = selId && !PINS.has(selId) && BY_ID.get(selId);
	const pt = c && c.fi != null && projectPoint(p, iconLL(c));
	if (!pt) return;
	const x0 = pt[0] - half, y0 = pt[1] - half;
	roundRect(ctx, x0, y0, s, s, r);
	ctx.fillStyle = COL.pinEmpty;
	ctx.fill();
	ctx.setLineDash([4, 3]);
	ctx.lineWidth = 1.4;
	ctx.strokeStyle = COL.target;
	ctx.stroke();
	ctx.setLineDash([]);
	const arm = Math.max(4, s * 0.16);
	ctx.beginPath();
	ctx.moveTo(pt[0] - arm, pt[1]);
	ctx.lineTo(pt[0] + arm, pt[1]);
	ctx.moveTo(pt[0], pt[1] - arm);
	ctx.lineTo(pt[0], pt[1] + arm);
	ctx.lineWidth = 1.6;
	ctx.stroke();
}

/* ---------------- quiz (practice / test) ---------------- */
let session = null, sessionSeq = 0, review = null;
const statKey = (id) => `${state.format}:${id}`;
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function startSession(onlyIds) {
	clearReview();
	setCallout(null);
	flashes = [];
	if (state.mode === 'study') {
		session = null;
		closeInput();
		startStudy(study && study.items.length ? study.items[study.index].id : null);
		renderAll();
		return;
	}
	study = null;
	let items = scopeCountries();
	if (onlyIds) items = items.filter((c) => onlyIds.includes(c.id));
	shuffle(items);
	if (state.mode === 'practice') {
		const hist = store.get('stats', {});
		const weak = (c) => {
			const h = hist[statKey(c.id)];
			return h ? h[1] - h[0] * 0.5 : 0;
		};
		items = items.map((c, i) => [c, weak(c), i]).sort((a, b) => b[1] - a[1] || a[2] - b[2]).map((x) => x[0]);
	}
	session = {
		id: ++sessionSeq, items, queue: items.slice(), total: items.length, done: 0, attempts: 0, correct: 0, streak: 0,
		start: performance.now(), end: null, current: null, phase: 'ask', everMissed: new Set(), result: new Map(), busy: false,
		tried: new Set(),
	};
	renderAll();
	nextItem();
}
function later(ms) {
	const id = session && session.id;
	setTimeout(() => {
		if (session && session.id === id) nextItem();
	}, ms);
}
function nextItem() {
	if (!session) return;
	setCallout(null);
	session.busy = false;
	if (!session.queue.length) return finishSession();
	session.current = session.queue.shift();
	showQuestion();
}
// Easy typing: leave this country for later (dir 1) or go back to the last one skipped (dir -1)
function moveQuestion(dir) {
	if (!session || !session.current || session.busy || review || session.phase === 'reveal') return;
	if (!session.queue.length) {
		toast(t('last_one'));
		return;
	}
	if (dir > 0) {
		session.queue.push(session.current);
		session.current = session.queue.shift();
	} else {
		session.queue.unshift(session.current);
		session.current = session.queue.pop();
	}
	$('answer').value = '';
	showQuestion();
}
function showQuestion() {
	session.phase = 'ask';
	if (state.format === 'type') {
		if (S.lightTyped) showCountry(session.current, true);
		openInput();
	} else closeInput();
	renderPrompt();
	invalidate();
}
function recordStat(id, ok) {
	const hist = store.get('stats', {});
	const h = hist[statKey(id)] || [0, 0];
	h[ok ? 0 : 1]++;
	hist[statKey(id)] = h;
	store.set('stats', hist);
}
function onMapClick(hit) {
	if (hit && hit.water) return toast(hit.water.text);
	if (review) return reviewPick(hit);
	if (state.mode === 'study') return studyPick(hit);
	if (!session || !session.current || session.busy) return;
	if (state.format === 'type') {
		// typed questions: clicks only say what you clicked
		if (hit && !hit.id) toastPlace(hit.i);
		return;
	}
	if (!hit) return;
	if (!hit.id) return toastPlace(hit.i);
	const c = BY_ID.get(hit.id);
	if (!inScope(c)) {
		toast(t('outside', { name: nameOf(c), region: regionLabel() }), 'bad');
		return;
	}
	// Easy: a country already coloured green or red has been answered, so a click on it doesn't count
	if (c.id !== session.current.id && statusOf(c.id)) return;
	const cur = session.current, right = c.id === cur.id;
	if (session.phase === 'reveal') {
		if (right) {
			flash(c.id, 'ok');
			session.busy = true;
			later(350);
		} else {
			flash(c.id, 'bad');
			toast(quiet() ? t('not_that_glow') : t('that_glow', { name: nameOf(c) }), 'bad');
		}
		return;
	}
	session.attempts++;
	if (right) gotIt(cur);
	else {
		flash(c.id, 'bad');
		// World Capitals says only what the answer was, never the capital of the country you clicked
		toast(quiet() ? t('not_that') : S.missClick(cur, c), 'bad');
		missed(cur, true);
	}
	renderStats();
}
function submitAnswer(text) {
	if (!session || !session.current || session.busy || state.format !== 'type' || review) return;
	const cur = session.current;
	// Enter with nothing typed moves on: Easy skips this country for later, Hard gives up on it
	// (the same as the Skip / Show me button; after a reveal it goes to the next country)
	if (!text.trim()) {
		if (session.phase !== 'reveal' && typeEasy()) moveQuestion(1);
		else skip();
		return;
	}
	const res = checkAnswer(cur, text, { strict: state.level === 'hard', keepSecret: typeEasy() && session.phase !== 'reveal' });
	if (session.phase === 'reveal') {
		if (res.ok) {
			$('answer').value = '';
			flash(cur.id, 'ok');
			session.busy = true;
			later(350);
		} else {
			badInput();
			toast(t('type_to_go_on', { answer: S.answer(cur) }), 'bad');
		}
		return;
	}
	session.attempts++;
	$('answer').value = '';
	if (res.ok) gotIt(cur, res.note, res.close);
	else if (typeEasy()) {
		// Easy: keep guessing; the first wrong guess counts against this country in practice history
		toast(res.msg, 'bad');
		badInput();
		session.streak = 0;
		pulsePrompt('bad');
		if (!session.tried.has(cur.id)) {
			session.tried.add(cur.id);
			recordStat(cur.id, false);
		}
	} else {
		toast(res.msg, 'bad');
		badInput();
		missed(cur, true);
	}
	renderStats();
}
// close: right, but misspelled (Easy typing). It turns yellow and scores half a point.
function gotIt(cur, note, close = false) {
	session.correct += close ? 0.5 : 1;
	session.streak++;
	session.done++;
	recordStat(cur.id, true);
	session.result.set(cur.id, session.everMissed.has(cur.id) ? 'bad' : close ? 'close' : 'ok');
	flash(cur.id, close ? 'close' : 'ok');
	pulsePrompt(close ? 'close' : 'ok');
	if (note) toast(note, close ? 'close' : 'ok');
	else if (quiet()) toast('Correct.', 'ok');
	else if (state.format === 'click') toast(t('correct_that', { name: nameOf(cur) }), 'ok');
	session.busy = true;
	renderPrompt();
	invalidate();
	later(state.mode === 'test' ? 300 : 480);
}
function missed(cur, answered) {
	session.streak = 0;
	recordStat(cur.id, false);
	pulsePrompt('bad');
	session.everMissed.add(cur.id);
	if (state.mode === 'test') {
		// tests move on, but show where it was
		session.result.set(cur.id, 'bad');
		flash(cur.id, 'reveal'); // (Hard clicking: flash() skips this, so the answer stays hidden)
		session.busy = true;
		renderPrompt();
		invalidate();
		later(answered ? 1100 : 700);
		return;
	}
	// practice: show it, make you answer it, and bring it back a few questions later
	session.queue.splice(Math.min(3, session.queue.length), 0, cur);
	session.phase = 'reveal';
	if (state.format === 'click') calloutFor(cur);
	showCountry(cur, state.format === 'type');
	renderPrompt();
	invalidate();
}
function skip() {
	if (state.mode === 'study' || !session || !session.current || session.busy || review) return;
	if (session.phase === 'reveal') {
		setCallout(null);
		nextItem();
		return;
	}
	session.attempts++;
	if (state.format === 'type') toast(S.fact(session.current));
	else if (state.mode === 'test' && !quiet()) toast(t('it_was', { name: nameOf(session.current) }));
	missed(session.current, false);
	renderStats();
}
function bestKey() {
	return `${state.mode}|${state.format}|${state.level}|${state.region}`;
}
function finishSession() {
	session.end = performance.now();
	session.current = null;
	closeInput();
	const ms = session.end - session.start;
	// misspelled answers (yellow) count half
	const statusOfItem = (c) => (session.everMissed.has(c.id) ? 'bad' : session.result.get(c.id) === 'close' ? 'close' : 'ok');
	const closeCount = session.items.filter((c) => statusOfItem(c) === 'close').length;
	const firstTry = session.total - session.everMissed.size - closeCount / 2;
	const acc = session.attempts ? Math.round((100 * session.correct) / session.attempts) : 0;
	const scoreNow = state.mode === 'test' ? session.correct : firstTry;
	const all = store.get('best', {});
	const prev = all[bestKey()];
	if (!prev || scoreNow > prev.score || (scoreNow === prev.score && ms < prev.ms)) {
		all[bestKey()] = { score: scoreNow, total: session.total, ms };
		store.set('best', all);
	}
	const missedIds = session.items.filter((c) => session.everMissed.has(c.id)).map((c) => c.id);
	const status = new Map(session.items.map((c) => [c.id, statusOfItem(c)]));
	const count = (st) => session.items.filter((c) => status.get(c.id) === st).length;
	review = { status, score: scoreNow, ok: count('ok'), close: closeCount, bad: count('bad'), acc, ms, best: all[bestKey()], missedIds };
	$('rOk').textContent = review.ok;
	$('rClose').textContent = review.close;
	$('rCloseKey').hidden = !review.close;
	$('rBad').textContent = review.bad;
	$('rOkLabel').textContent = state.mode === 'test' || typeEasy() ? t('r_correct') : t('r_first');
	$('rBadLabel').textContent = typeEasy() ? t('r_gave_up') : state.mode === 'test' ? t('r_missed') : t('r_needed_help');
	$('rPractice').hidden = !missedIds.length;
	renderAll();
	$('sTime').textContent = fmtTime(ms);
	frameRegion();
}
function clearReview() {
	if (!review) return;
	review = null;
	setCallout(null);
	$('review').hidden = true;
	$('pBarWrap').classList.remove('is-off');
	syncMore();
	invalidate();
}
function reviewPick(hit) {
	if (!hit) return;
	if (!hit.id) return toastPlace(hit.i);
	const c = BY_ID.get(hit.id);
	if (!review.status.get(c.id)) return toast(S.fact(c));
	// the map's green / red already says how it went
	calloutFor(c);
}
$('rAgain').addEventListener('click', () => startSession());
$('rPractice').addEventListener('click', () => {
	const ids = review ? review.missedIds.slice() : [];
	setMode('practice', false);
	startSession(ids);
});

/* ---------------- typed answer box ---------------- */
function openInput() {
	$('answerForm').hidden = false;
	$('answer').classList.remove('is-bad');
	$('answer').placeholder = session && session.phase === 'reveal' ? t('type_x', { answer: S.answer(session.current) }) : S.placeholder();
	syncMore();
	if (!narrow() || document.activeElement === $('answer')) $('answer').focus({ preventScroll: true });
}
function closeInput() {
	const form = $('answerForm');
	if (form.hidden) return;
	form.hidden = true;
	$('answer').value = '';
	syncMore();
}
function badInput() {
	const el = $('answer');
	el.classList.add('is-bad');
	setTimeout(() => el.classList.remove('is-bad'), 700);
	if (session && session.phase === 'reveal') el.placeholder = t('type_x', { answer: S.answer(session.current) });
}
// Enter that finishes a word in a Chinese, Japanese or Korean input method isn't an answer yet (Safari sends it
// just after compositionend, so a few milliseconds after one count too)
let composedAt = -1e9;
$('answer').addEventListener('compositionend', () => (composedAt = performance.now()));
$('answer').addEventListener('keydown', (e) => {
	if (e.key === 'Enter' && (e.isComposing || e.keyCode === 229 || performance.now() - composedAt < 80)) e.preventDefault();
});
$('answerForm').addEventListener('submit', (e) => {
	e.preventDefault();
	submitAnswer($('answer').value);
	if (session && session.phase === 'reveal' && state.format === 'type') $('answer').placeholder = t('type_x', { answer: S.answer(session.current) });
});

/* ---------------- prompt, stats and panels ---------------- */
function fmtTime(ms) {
	const s = Math.floor(ms / 1000);
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
function fitName() {
	const el = $('pName');
	el.style.fontSize = '';
	el.style.whiteSpace = 'nowrap';
	const base = parseFloat(getComputedStyle(el).fontSize) || 28;
	el.style.lineHeight = (base * 1.1).toFixed(1) + 'px';
	const avail = el.clientWidth;
	if (!avail) return;
	let size = base;
	for (let i = 0; i < 5 && el.scrollWidth > avail + 1 && size > base * 0.55; i++) {
		size = Math.max(base * 0.55, size * (avail / el.scrollWidth) * 0.98);
		el.style.fontSize = size.toFixed(1) + 'px';
	}
	if (el.scrollWidth > avail + 1) el.style.whiteSpace = 'normal';
}
// The big line of the prompt. On World Flags a flag goes before the name, or stands alone when it's the question.
let nameFlag = null; // the flag picture, kept so it doesn't reload on every redraw
function setName(text, flag) {
	const el = $('pName');
	el.classList.toggle('flag-only', !!flag && !text);
	if (!flag) {
		el.textContent = text;
		return;
	}
	if (!nameFlag) nameFlag = flagImg(flag);
	else if (nameFlag.dataset.id !== flag) nameFlag.src = flagUrl(flag);
	nameFlag.dataset.id = flag;
	nameFlag.alt = text ? '' : t('flag_to_find');
	el.replaceChildren(nameFlag, ...(text ? [document.createTextNode(text)] : []));
}
function setTip(text) {
	const t = $('pTip');
	t.hidden = !text;
	t.textContent = text || '';
}
function renderPrompt() {
	renderPromptText();
	syncMore();
	fitName();
}
// Show the panel under the prompt card when it has something in it
function syncMore() {
	const any = !$('pTip').hidden || !$('answerForm').hidden || !$('review').hidden || !$('pinBar').hidden;
	$('pMore').hidden = !any;
	$('prompt').classList.toggle('has-more', any);
}
function renderPromptText() {
	const pr = $('prompt');
	pr.classList.toggle('is-reveal', !!session && session.phase === 'reveal' && !review);
	const reg = regionLabel();
	$('review').hidden = !review;
	$('pBarWrap').classList.toggle('is-off', !!review);
	renderDock();
	renderPinBar();
	if (state.mode === 'study') {
		if (!study || !study.items.length) {
			$('pEyebrow').textContent = state.pins ? 'Images' : t('mode_study');
			setName(t('nothing_to_study'));
			$('pMeta').textContent = reg;
			setTip('');
			return;
		}
		$('pEyebrow').textContent = `${state.pins ? 'Images' : t('mode_study')} · ${reg}`;
		if (study.cleared) {
			setName(t('pick_country'));
			$('pMeta').textContent = t('study_meta_all', { n: study.items.length });
			setTip('');
			return;
		}
		const c = study.items[study.index], st = S.study(c);
		setName(st.name, st.flag);
		if (state.pins) {
			const have = study.items.filter((x) => PINS.has(x.id)).length;
			$('pMeta').textContent = `${study.index + 1} of ${study.items.length} · ${have} with images${narrow() ? '' : ` · ${PASTE_KEY} pastes onto this one`}`;
		} else $('pMeta').textContent = t('study_meta', { i: study.index + 1, n: study.items.length });
		setTip(st.tip);
		$('pBar').style.width = ((100 * (study.index + 1)) / study.items.length).toFixed(1) + '%';
		return;
	}
	setTip('');
	if (!session) return;
	if (!session.total) {
		$('pEyebrow').textContent = state.mode === 'test' ? t('mode_test') : t('mode_practice');
		setName(t('no_countries'));
		$('pMeta').textContent = reg;
		return;
	}
	if (review) {
		$('pEyebrow').textContent = `${state.mode === 'test' ? t('test_complete') : t('set_learned')} · ${reg}`;
		setName(`${review.score} / ${session.total}`);
		$('pMeta').textContent = t('review_meta', { acc: review.acc, time: fmtTime(review.ms), best: review.best.score, total: review.best.total });
		return;
	}
	const cur = session.current;
	if (!cur) {
		$('pEyebrow').textContent = state.mode === 'test' ? t('test_finished') : t('set_learned');
		setName(t('n_of_n', { a: session.total - session.everMissed.size, n: session.total }));
	} else {
		const q = (state.format === 'click' ? (session.phase === 'reveal' ? S.clickReveal : S.clickAsk) : session.phase === 'reveal' ? S.typeReveal : S.typeAsk)(cur);
		$('pEyebrow').textContent = q.eyebrow;
		setName(q.name, q.flag);
		if (q.tip) setTip(q.tip);
	}
	const answered = session.total - session.queue.length - (cur ? 1 : 0);
	$('pMeta').textContent = state.mode === 'test' ? t('meta_answered', { region: reg, a: answered, n: session.total }) : t('meta_learned', { region: reg, a: session.done, n: session.total });
	const frac = state.mode === 'test' ? answered / session.total : session.done / session.total;
	$('pBar').style.width = (100 * frac).toFixed(1) + '%';
}
let promptTimer = 0;
function pulsePrompt(kind) {
	const pr = $('prompt');
	pr.classList.remove('is-ok', 'is-bad', 'is-close');
	pr.classList.add(kind === 'ok' ? 'is-ok' : kind === 'close' ? 'is-close' : 'is-bad');
	clearTimeout(promptTimer);
	promptTimer = setTimeout(() => pr.classList.remove('is-ok', 'is-bad', 'is-close'), 600);
}
function renderStats() {
	const s = session;
	$('sAcc').textContent = s && s.attempts ? Math.round((100 * s.correct) / s.attempts) + '%' : '–';
	$('sStreak').textContent = s ? s.streak : 0;
	if (!s) $('sTime').textContent = '0:00';
}
setInterval(() => {
	if (session && !session.end && !pendingConfirm) $('sTime').textContent = fmtTime(performance.now() - session.start);
}, 250);
function renderRail() {
	const title = document.createElement('div');
	title.className = 'rail-title';
	title.textContent = t('rail_title');
	const kids = [title];
	const button = (r, sub) => {
		const b = document.createElement('button');
		b.type = 'button';
		b.dataset.region = r.key;
		if (sub) b.className = 'sub';
		b.setAttribute('aria-pressed', String(state.region === r.key));
		const l = document.createElement('span');
		l.textContent = regionName(r.key);
		const n = document.createElement('em');
		n.textContent = COUNTRIES.filter((c) => inRegion(c, r.key)).length;
		b.append(l, n);
		return b;
	};
	// the chosen continent (or the continent of the chosen subregion) lists its subregions under it
	const open = REGION[state.region].parent || state.region;
	for (const r of REGIONS) {
		kids.push(button(r, false));
		if (r.key === open) for (const s of SUBREGIONS) if (s.parent === r.key) kids.push(button(s, true));
	}
	$('rail').replaceChildren(...kids);
	const rail = $('rail'), sel = rail.querySelector('[aria-pressed="true"]');
	if (sel && rail.scrollWidth > rail.clientWidth) rail.scrollLeft = Math.max(0, sel.offsetLeft - 24);
}
$('rail').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-region]');
	if (!b) return;
	const key = b.dataset.region;
	guardTest(key === state.region ? t('restarting') : t('switching_to', { region: regionLabel(key) }), () => {
		state.region = key;
		store.set('region', key);
		renderRail();
		frameRegion();
		startSession();
	});
});
function renderZoom() {
	const grid = $('zoomGrid');
	if (grid.dataset.lang !== lang()) grid.replaceChildren(); // built again in another language
	grid.dataset.lang = lang();
	if (!grid.children.length) {
		ZOOM_KEYS.forEach((k, i) => {
			const b = document.createElement('button');
			b.type = 'button';
			b.className = 'zchip';
			b.dataset.area = k;
			const l = document.createElement('span');
			l.textContent = regionName(k);
			const kb = document.createElement('kbd');
			kb.textContent = String((i + 1) % 10);
			b.append(l, kb);
			grid.append(b);
		});
	}
	for (const b of grid.children) b.setAttribute('aria-pressed', String(state.zoomArea === b.dataset.area));
}
$('zoomGrid').addEventListener('click', (e) => {
	const b = e.target.closest('[data-area]');
	if (!b) return;
	frameArea(b.dataset.area);
	closeViewSheetOnPhone();
});
// the hints under each setting, in the language in use
const MODE_HINT = { study: () => S.hint('study'), practice: () => t('hint_practice'), test: () => t('hint_test') };
const FORMAT_HINT = { click: () => S.hint('click'), type: () => S.hint('type') };
function renderSegs() {
	$('imagesModeBtn').hidden = !state.pins; // the hidden mode shows up in the bar only while it's on
	for (const [id, v] of [['modeSeg', state.pins ? 'images' : state.mode], ['formatSeg', state.format], ['viewSeg', state.view]]) {
		for (const b of $(id).querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.v === v));
	}
	$('modeHint').textContent = state.pins
		? `Pick a country, then paste a picture onto it (${PASTE_KEY}), upload one, or drag one onto the country. Pictures stay in this browser only. I turns this mode off.`
		: MODE_HINT[state.mode]();
	$('formatHint').textContent = FORMAT_HINT[state.format]();
	for (const b of $('levelSeg').querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.v === state.level));
	$('levelHint').textContent = LEVEL_HINT[state.format][state.level]();
	$('levelBox').hidden = state.mode === 'study';
	$('searchBox').hidden = state.mode !== 'study';
	renderDock();
	$('keysHint').innerHTML = voiceOffered() ? t('keys') : t('keys_no_voice');
}
const LEVEL_HINT = {
	click: { easy: () => t('hint_click_easy'), hard: () => t('hint_click_hard') },
	type: { easy: () => t('hint_type_easy'), hard: () => S.hint('type_hard') },
};
// Bottom buttons: Previous / Next in Study; Back / Skip / Give up for Easy typing; Show me (or Skip) otherwise
function renderDock() {
	const study = state.mode === 'study', nav = typeEasy() && !review;
	$('prevBtn').hidden = !(study || nav);
	$('nextBtn').hidden = !(study || nav);
	$('prevBtn').textContent = '← ' + (nav ? t('back') : t('prev'));
	$('nextBtn').textContent = (nav ? t('skip') : t('next')) + ' →';
	$('giveUpBtn').hidden = !nav;
	$('skipBtn').hidden = study || nav || !!review;
	$('skipBtn').textContent = state.mode === 'test' ? t('skip') : t('show_me');
}
function renderBest() {
	const el = $('best');
	if (state.mode === 'study') {
		el.textContent = '';
		return;
	}
	const b = store.get('best', {})[bestKey()];
	if (!b) {
		el.textContent = t('no_best');
		return;
	}
	el.innerHTML = t('best_here', { score: b.score, total: b.total, time: fmtTime(b.ms) });
}
function renderAll() {
	renderSegs();
	renderBest();
	renderPrompt();
	renderStats();
	invalidate();
}
function setMode(m, restart = true) {
	state.mode = m;
	store.set('mode', m);
	if (m !== 'study' && state.pins) {
		state.pins = false;
		store.set('imageMode', false);
	}
	renderSegs();
	renderBest();
	if (restart) startSession();
}
function setFormat(f) {
	state.format = f;
	store.set('format', f);
	renderSegs();
	renderBest();
	startSession();
}
function setView(v) {
	if (v === state.view) return;
	// keep the same spot and roughly the same scale when switching between globe and flat map
	cancelFly();
	cam.zoom *= baseScale(state.view) / baseScale(v);
	state.view = v;
	store.set('view', v);
	constrain();
	updateProj();
	renderSegs();
	invalidate();
}
$('modeSeg').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-v]');
	const v = b && b.dataset.v;
	if (!v || v === (state.pins ? 'images' : state.mode)) return;
	if (v === 'images') return setPins(true);
	if (v === 'study' && state.pins) return setPins(false); // from Images back to plain Study (from Practice or Test, a normal switch)
	guardTest(t('changing_mode'), () => setMode(v));
});
$('formatSeg').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-v]');
	if (!b || b.dataset.v === state.format) return;
	guardTest(t('changing_format'), () => setFormat(b.dataset.v));
});
$('viewSeg').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-v]');
	if (b) setView(b.dataset.v);
});
$('restartBtn').addEventListener('click', () => guardTest('Restarting', () => startSession()));
$('prevBtn').addEventListener('click', () => (state.mode === 'study' ? studyStep(-1) : moveQuestion(-1)));
$('nextBtn').addEventListener('click', () => (state.mode === 'study' ? studyStep(1) : moveQuestion(1)));
$('skipBtn').addEventListener('click', skip);
$('giveUpBtn').addEventListener('click', skip);
$('levelSeg').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-v]');
	if (!b || b.dataset.v === state.level) return;
	guardTest(t('changing_level'), () => {
		state.level = b.dataset.v;
		store.set('level', state.level);
		renderSegs();
		renderBest();
		startSession();
	});
});
$('zoomInBtn').addEventListener('click', () => {
	const f = free();
	zoomAround(f.cx, f.cy, 1.7);
});
$('zoomOutBtn').addEventListener('click', () => {
	const f = free();
	zoomAround(f.cx, f.cy, 1 / 1.7);
});
$('resetBtn').addEventListener('click', () => {
	frameRegion();
	closeViewSheetOnPhone();
});

/* ---------- search (study) ---------- */
$('search').addEventListener('input', () => {
	const q = norm($('search').value);
	const list = $('searchList');
	if (!q) {
		list.replaceChildren();
		return;
	}
	// other names for a country count too ("turkey" finds Türkiye)
	// the names in the language in use count, and the English ones
	const hits = COUNTRIES.filter((c) => [nameOf(c), capitalOf(c), c.name, c.capital, ...(c.alts || []), ...(COUNTRY_WORDS[c.id] || [])].some((s) => norm(s).includes(q)))
		.sort((a, b) => Number(!norm(nameOf(a)).startsWith(q)) - Number(!norm(nameOf(b)).startsWith(q)) || nameOf(a).localeCompare(nameOf(b), locale()))
		.slice(0, 12);
	list.replaceChildren(
		...hits.map((c) => {
			const li = document.createElement('li');
			const b = document.createElement('button');
			b.type = 'button';
			const a = document.createElement('span');
			a.textContent = nameOf(c);
			const d = document.createElement('span');
			d.textContent = capitalOf(c);
			b.append(a, d);
			b.addEventListener('click', () => {
				if (!inScope(c)) {
					state.region = 'world';
					store.set('region', 'world');
					renderRail();
				}
				startStudy(c.id);
				showCountry(c, false);
				renderAll();
				setSheet(null);
			});
			li.append(b);
			return li;
		}),
	);
});

/* ---------- toast ---------- */
let toastTimer = 0;
function toast(msg, kind) {
	const t = $('toast');
	t.textContent = msg;
	t.className = 'toast show' + (kind ? ' ' + kind : '');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => (t.className = 'toast'), 2600);
}

/* ---------- phones: settings and view are bottom sheets ---------- */
function setSheet(which) {
	document.body.classList.toggle('sheet-open', which === 'settings');
	document.body.classList.toggle('view-open', which === 'view');
}
function closeViewSheetOnPhone() {
	if (narrow()) setSheet(null);
}
$('settingsBtn').addEventListener('click', () => setSheet(document.body.classList.contains('sheet-open') ? null : 'settings'));
$('viewBtn').addEventListener('click', () => setSheet(document.body.classList.contains('view-open') ? null : 'view'));
$('closeSheet').addEventListener('click', () => setSheet(null));
$('closeView').addEventListener('click', () => setSheet(null));

/* ---------- clean view (for recording) ---------- */
function setClean(on) {
	state.clean = on;
	document.body.classList.toggle('clean', on);
	setSheet(null);
	renderPrompt(); // the Images buttons hide in the clean view
	resize();
}
$('cleanBtn').addEventListener('click', () => setClean(true));
$('cleanExit').addEventListener('click', () => setClean(false));

/* ---------------- confirm before throwing away a test in progress ---------------- */
function testInProgress() {
	return state.mode === 'test' && !!session && !session.end && !!session.current && session.attempts > 0;
}
let pendingConfirm = null;
function guardTest(what, action) {
	if (!testInProgress()) {
		action();
		return;
	}
	const answered = session.total - session.queue.length - 1;
	$('confirmMsg').textContent = t('confirm_msg', { a: answered, n: session.total, region: regionLabel(), what });
	pendingConfirm = { action, t0: performance.now() };
	$('confirm').hidden = false;
	$('confirmNo').focus();
}
function closeConfirm(go) {
	const p = pendingConfirm;
	if (!p) return;
	pendingConfirm = null;
	$('confirm').hidden = true;
	if (go) {
		setSheet(null);
		p.action();
	} else if (session && !session.end) session.start += performance.now() - p.t0;
}
$('confirmYes').addEventListener('click', () => closeConfirm(true));
$('confirmNo').addEventListener('click', () => closeConfirm(false));
$('confirm').addEventListener('click', (e) => {
	if (e.target === $('confirm')) closeConfirm(false);
});
$('homeLink').addEventListener('click', (e) => {
	if (!testInProgress()) return;
	e.preventDefault();
	const href = e.currentTarget.href;
	guardTest(t('leaving'), () => {
		location.href = href;
	});
});

/* ---------------- spinning globe (hidden) ---------------- */
// S on the globe: everything but the globe fades away, the globe tilts to show the north (where most
// capitals are) and turns on its own the way the Earth does, every capital marked and named where
// there's room. S again goes faster (three speeds, then back to the first); Esc stops it and puts the
// view back. You can still drag and zoom; clicks don't select anything. Not listed in the key hints.
function spinKey() {
	if (spin.on) {
		spin.level = (spin.level % 3) + 1;
		return;
	}
	if (state.view !== 'globe' || !proj) return;
	if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
	spin.on = true;
	spin.level = 1;
	spin.speed = 0;
	spin.last = spin.fxLast = 0;
	spin.labels.clear();
	spin.back = { cam: { ...cam }, zoomArea: state.zoomArea };
	setSheet(null);
	setHover(null);
	document.body.classList.add('spinning');
	keepGlobeSize(resize); // the globe gets the whole screen
	flyTo({ lon: cam.lon, lat: 20, zoom: 0.92 }, 1400);
}
function stopSpin() {
	if (!spin.on) return;
	spin.on = false;
	document.body.classList.remove('spinning');
	keepGlobeSize(resize);
	flyTo(spin.back.cam, 1000);
	state.zoomArea = spin.back.zoomArea;
	renderZoom();
}
// Give the globe more or less of the screen without it jumping in size
function keepGlobeSize(fn) {
	const s = baseScale() * cam.zoom;
	fn();
	cam.zoom = s / baseScale();
	constrain();
	updateProj();
}
// One frame of the turn, eased between speeds. It waits while the camera flies in.
function stepSpin(now) {
	if (!spin.on) return;
	const dt = spin.last ? Math.min(0.1, (now - spin.last) / 1000) : 0;
	spin.last = now;
	if (fly) return;
	spin.speed += (SPIN_SPEEDS[spin.level] - spin.speed) * Math.min(1, dt * 1.2);
	cam.lon -= spin.speed * dt; // west to east, like the Earth
	constrain();
	updateProj();
	interacting(); // the map counts as moving: no water names, and less detail on slow devices
	baseDirty = true;
}
// Every capital on the near side, fading toward the rim, and as many names as fit. Names already
// showing keep their place, then the biggest countries' capitals go first, so names don't flicker
// as the globe turns; they fade in and out instead of popping.
const spinWidths = new Map();
function drawSpinFx(ctx, p, now) {
	const dt = spin.fxLast ? Math.min(0.1, (now - spin.fxLast) / 1000) : 0;
	spin.fxLast = now;
	if (!labelFont) labelFont = getComputedStyle(document.body).fontFamily;
	const size = layout.w < 600 ? 10 : 11.5, lh = size + 4;
	ctx.font = `600 ${size}px ${labelFont}`;
	const textW = (t) => {
		const k = size + '|' + t;
		if (!spinWidths.has(k)) spinWidths.set(k, ctx.measureText(t).width);
		return spinWidths.get(k);
	};
	const ctr = [cam.lon, cam.lat], pts = [];
	for (const c of COUNTRIES) {
		if (c.fi == null) continue;
		const d = geoDistance([c.lon, c.lat], ctr);
		if (d > Math.PI / 2 - 0.02) continue;
		const xy = p([c.lon, c.lat]);
		if (!xy || !isFinite(xy[0])) continue;
		pts.push({ c, x: xy[0], y: xy[1], face: Math.min(1, Math.max(0, (Math.cos(d) - 0.08) / 0.3)), area: META[c.fi].area });
	}
	// where the names go
	const taken = pts.filter((q) => q.face > 0.3).map((q) => [q.x - 3.5, q.y - 3.5, q.x + 3.5, q.y + 3.5]);
	const clear = (b) => b[0] > 4 && b[2] < layout.w - 4 && b[1] > 4 && b[3] < layout.h - 4 && !taken.some((t) => b[0] < t[2] && b[2] > t[0] && b[1] < t[3] && b[3] > t[1]);
	const showing = (id) => (spin.labels.get(id) || { a: 0 }).a > 0.5;
	pts.sort((a, b) => showing(b.c.id) - showing(a.c.id) || b.area - a.area);
	const placed = new Map(); // id -> left
	for (const q of pts) {
		if (q.face < 0.45) continue;
		const w = textW(S.label(q.c)), prev = spin.labels.get(q.c.id);
		const right = [q.x + 6, q.y - lh / 2, q.x + 8 + w, q.y + lh / 2], left = [q.x - 8 - w, q.y - lh / 2, q.x - 6, q.y + lh / 2];
		const order = prev && prev.left ? [[left, true], [right, false]] : [[right, false], [left, true]];
		const ok = order.find(([b]) => clear(b));
		if (!ok) continue;
		taken.push(ok[0]);
		placed.set(q.c.id, ok[1]);
	}
	// dots
	ctx.lineWidth = 1.1;
	for (const q of pts) {
		ctx.globalAlpha = q.face;
		ctx.beginPath();
		ctx.arc(q.x, q.y, 2.4, 0, TAU);
		ctx.fillStyle = COL.dot;
		ctx.fill();
		ctx.strokeStyle = COL.ring;
		ctx.stroke();
	}
	// names, faded in and out
	ctx.textBaseline = 'middle';
	ctx.lineJoin = 'round';
	for (const q of pts) {
		const id = q.c.id, prev = spin.labels.get(id) || { a: 0, left: false };
		const want = placed.has(id);
		const a = prev.a + ((want ? 1 : 0) - prev.a) * Math.min(1, dt * 5);
		const lab = { a, left: want ? placed.get(id) : prev.left };
		if (a < 0.02) {
			spin.labels.delete(id);
			continue;
		}
		spin.labels.set(id, lab);
		ctx.globalAlpha = a * q.face;
		ctx.textAlign = lab.left ? 'right' : 'left';
		const x = lab.left ? q.x - 7 : q.x + 7;
		ctx.lineWidth = 3;
		ctx.strokeStyle = COL.labelHalo;
		ctx.strokeText(S.label(q.c), x, q.y);
		ctx.fillStyle = COL.ring;
		ctx.fillText(S.label(q.c), x, q.y);
	}
	// names whose capital went round the back
	const front = new Set(pts.map((q) => q.c.id));
	for (const id of spin.labels.keys()) if (!front.has(id)) spin.labels.delete(id);
	ctx.globalAlpha = 1;
	ctx.textAlign = 'left';
}

/* ---------------- keyboard ---------------- */
document.addEventListener('keydown', (e) => {
	if (pendingConfirm) {
		if (e.key === 'Escape') closeConfirm(false);
		return;
	}
	const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
	if (spin.on) {
		// while the globe spins: S goes faster, Esc stops it, + and − zoom; nothing else
		const f = free();
		if (e.key === 'Escape') stopSpin();
		else if ((e.key === 's' || e.key === 'S') && !e.metaKey && !e.ctrlKey && !e.altKey) spinKey();
		else if (e.key === '+' || e.key === '=') zoomAround(f.cx, f.cy, 1.25);
		else if (e.key === '-' || e.key === '_') zoomAround(f.cx, f.cy, 1 / 1.25);
		else return;
		e.preventDefault();
		return;
	}
	if (e.key === 'Escape') {
		// as in the 3D atlases: the first Esc clears what's selected, the next goes back to the region
		if (document.body.classList.contains('sheet-open') || document.body.classList.contains('view-open')) setSheet(null);
		else if (!typing && studySelected()) clearStudySelection();
		else if (!typing && review && callout) setCallout(null);
		else if (state.clean) setClean(false);
		else if (!typing) frameRegion();
		return;
	}
	if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
	const f = free();
	if (e.key === 'ArrowRight') studyStep(1);
	else if (e.key === 'ArrowLeft') studyStep(-1);
	else if (/^[0-9]$/.test(e.key)) {
		const k = ZOOM_KEYS[(Number(e.key) + 9) % 10];
		if (k) frameArea(k);
	} else if (e.key === '+' || e.key === '=') zoomAround(f.cx, f.cy, 1.7);
	else if (e.key === '-' || e.key === '_') zoomAround(f.cx, f.cy, 1 / 1.7);
	else if (e.key === 'g' || e.key === 'G') setView(state.view === 'globe' ? 'map' : 'globe');
	else if ((e.key === 'v' || e.key === 'V') && voiceOffered()) setVoice(!voice.on);
	else if (e.key === 'c' || e.key === 'C') setClean(!state.clean);
	else if (e.key === 'r' || e.key === 'R') frameRegion();
	else if (e.key === 'l' || e.key === 'L') setNames(!state.names, true);
	else if (e.key === 'i' || e.key === 'I') setPins(!state.pins); // the hidden Images mode (not listed in the key hints)
	else if (e.key === 's' || e.key === 'S') spinKey(); // the hidden spinning globe (globe view only; not listed either)
	else return;
	e.preventDefault();
});

/* ---------------- voice commands ---------------- */
// Say a place: a region ("Europe"), a subregion or area ("West Africa", "Caribbean"), any country ("Japan"),
// "globe" / "flat map", "zoom in" / "zoom out", or "world". A command only fires when the whole
// phrase is a command. Capitals aren't commands, so voice can't answer a question for you.
// Uses the browser's own speech recognition (Chrome, Edge, Safari; not Firefox).
const AREA_WORDS = {
	world: ['world', 'whole world', 'the world', 'earth', 'everything', 'whole map'],
	europe: ['europe'],
	asia: ['asia'],
	'north-america': ['north america'],
	'south-america': ['south america'],
	africa: ['africa'],
	oceania: ['oceania', 'australasia'],
	caribbean: ['caribbean', 'caribbean islands', 'west indies', 'carribean'],
	'middle-east': ['middle east', 'mideast', 'near east'],
	pacific: ['pacific', 'pacific islands', 'south pacific', 'pacific ocean'],
	'central-america': ['central america'],
	'north-central-america': ['north and central america', 'north central america', 'north america and central america'],
	'northern-europe': ['northern europe', 'north europe'],
	'southern-europe': ['southern europe', 'south europe'],
	'south-central-asia': ['south and central asia', 'south central asia', 'southern and central asia', 'central and south asia'],
	'australia-melanesia': ['australia and melanesia', 'australia melanesia'],
	'micronesia-polynesia': ['micronesia and polynesia', 'micronesia polynesia'],
	'lesser-antilles': ['lesser antilles', 'eastern caribbean', 'windward islands', 'leeward islands'],
	'southeast-asia': ['southeast asia', 'south east asia'],
	'east-asia': ['east asia', 'far east'],
	'south-asia': ['south asia', 'indian subcontinent'],
	'central-asia': ['central asia', 'the stans'],
	'persian-gulf': ['persian gulf', 'gulf', 'arabian gulf', 'gulf states'],
	balkans: ['balkans', 'balkan'],
	scandinavia: ['scandinavia', 'nordics', 'nordic countries'],
	'western-europe': ['western europe', 'west europe'],
	'eastern-europe': ['eastern europe', 'east europe'],
	'north-africa': ['north africa', 'northern africa'],
	'west-africa': ['west africa', 'western africa'],
	'central-africa': ['central africa'],
	'east-africa': ['east africa', 'eastern africa', 'horn of africa'],
	'southern-africa': ['southern africa'],
	polynesia: ['polynesia'],
	melanesia: ['melanesia'],
	'micronesia-region': ['micronesia region', 'micronesian islands'],
};
const COUNTRY_WORDS = {
	USA: ['usa', 'us', 'america', 'united states of america', 'the states'],
	GBR: ['uk', 'britain', 'great britain', 'england', 'scotland', 'wales', 'united kingdom'],
	CZE: ['czech republic'],
	CIV: ['ivory coast', 'cote divoire', 'cote d ivoire'],
	COD: ['democratic republic of the congo', 'drc', 'congo kinshasa', 'dr congo', 'democratic republic of congo'],
	COG: ['congo', 'republic of congo', 'congo brazzaville'],
	MMR: ['burma'],
	SWZ: ['swaziland'],
	TLS: ['east timor'],
	NLD: ['holland'],
	MKD: ['macedonia'],
	CPV: ['cape verde'],
	VAT: ['vatican', 'holy see'],
	FSM: ['federated states of micronesia'],
	ARE: ['uae', 'emirates'],
	KOR: ['korea'],
	RUS: ['russian federation'],
	TUR: ['turkey', 'turkiye'],
	BIH: ['bosnia'],
	TTO: ['trinidad'],
	ATG: ['antigua'],
	KNA: ['saint kitts', 'st kitts'],
	VCT: ['saint vincent', 'st vincent'],
	LCA: ['st lucia'],
	STP: ['sao tome'],
	PSX: ['palestinian territories', 'west bank'],
	CAF: ['central african republic', 'car'],
	SLB: ['solomons'],
	MHL: ['marshalls'],
	NZL: ['nz'],
	PNG: ['png'],
	DOM: ['dominican republic'],
	PHL: ['philippines'],
};
const voiceForm = (s) => norm(s).replace(/s$/, '');
const VOICE_LOOKUP = new Map();
function buildVoice() {
	for (const [k, list] of Object.entries(AREA_WORDS)) for (const w of list) VOICE_LOOKUP.set(voiceForm(w), { area: k });
	for (const c of COUNTRIES) VOICE_LOOKUP.set(voiceForm(c.name), { country: c.id });
	for (const [id, list] of Object.entries(COUNTRY_WORDS)) for (const w of list) VOICE_LOOKUP.set(voiceForm(w), { country: id });
	for (const w of ['globe', 'the globe', '3d', 'three d', 'globe view', 'sphere', 'ball']) VOICE_LOOKUP.set(voiceForm(w), { view: 'globe' });
	for (const w of ['map', 'flat map', 'flat', '2d', 'two d', 'map view', 'flat view']) VOICE_LOOKUP.set(voiceForm(w), { view: 'map' });
	for (const w of ['zoom out', 'back', 'reset view', 'reset']) VOICE_LOOKUP.set(voiceForm(w), { zoom: 'out' });
	for (const w of ['zoom in', 'closer', 'zoom closer']) VOICE_LOOKUP.set(voiceForm(w), { zoom: 'in' });
}
const VOICE_FILLER = new Set(['ok', 'okay', 'um', 'uh', 'so', 'now', 'and', 'hey', 'alright']);
const VOICE_PREFIX = new Set(['zoom', 'in', 'on', 'to', 'into', 'onto', 'show', 'me', 'go', 'view', 'look', 'at', 'focus', 'the', 'take', 'switch', 'fly', 'move']);
function parseVoice(raw) {
	const w = String(raw).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z\s']/g, ' ').split(/\s+/).filter(Boolean); // accents off first: "Türkiye"
	while (w.length && VOICE_FILLER.has(w[0])) w.shift();
	while (w.length && (w[w.length - 1] === 'please' || w[w.length - 1] === 'thanks')) w.pop();
	if (!w.length) return null;
	const direct = VOICE_LOOKUP.get(voiceForm(w.join(' ')));
	if (direct) return direct;
	while (w.length > 1 && VOICE_PREFIX.has(w[0])) w.shift();
	if (w.length > 1 && w[w.length - 1] === 'view') w.pop();
	return VOICE_LOOKUP.get(voiceForm(w.join(' '))) || null;
}
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
const VOICE_ONE_SHOT = /^((?!chrome|chromium|crios|android|edg|fxios).)*safari/i.test(navigator.userAgent);
const voice = { on: false, rec: null, startedAt: 0, gotResult: false, quickEnds: 0, fired: new Map(), steady: 0, restart: 0 };
function voiceStatus(text, kind) {
	const el = $('voiceHeard');
	el.textContent = text;
	el.className = 'voice-heard' + (kind ? ' ' + kind : '');
	el.hidden = !text;
}
function setVoice(on, reason) {
	if (on && !SpeechRec) {
		toast('Voice commands need Chrome, Edge or Safari. Firefox doesn’t support speech recognition.', 'bad');
		return;
	}
	voice.on = on;
	$('voiceBtn').setAttribute('aria-pressed', String(on));
	clearTimeout(voice.restart);
	clearTimeout(voice.steady);
	if (on) {
		voice.quickEnds = 0;
		voiceStatus('Listening… say “Caribbean”, “Japan”, “globe” or “map”');
		voiceStart();
	} else {
		const rec = voice.rec;
		voice.rec = null;
		if (rec) {
			try {
				rec.abort();
			} catch (e) {
				/* already stopped */
			}
		}
		voiceStatus(reason || '', reason ? 'bad' : '');
		if (reason && (state.clean || narrow())) toast(reason, 'bad');
	}
}
function voiceStart() {
	if (!voice.on || voice.rec || document.hidden) return;
	const rec = new SpeechRec();
	rec.lang = /^en\b/i.test(navigator.language || '') ? navigator.language : 'en-US';
	rec.continuous = !VOICE_ONE_SHOT;
	rec.interimResults = true;
	rec.maxAlternatives = 3;
	voice.rec = rec;
	voice.fired = new Map();
	voice.startedAt = performance.now();
	voice.gotResult = false;
	rec.onresult = (e) => {
		if (voice.rec === rec) onVoiceResult(e, rec);
	};
	rec.onerror = (e) => {
		if (voice.rec !== rec) return;
		const stop = {
			'not-allowed': 'Microphone blocked. Allow it from the icon in the address bar.',
			'service-not-allowed': 'Speech recognition isn’t allowed on this page.',
			'audio-capture': 'No microphone found. Plug one in, then turn Voice on again.',
			'language-not-supported': 'Speech recognition doesn’t support this browser’s language.',
		}[e.error];
		if (stop) {
			setVoice(false, stop);
			return;
		}
		if (e.error === 'network') voiceStatus('Can’t reach the speech service. Retrying…', 'bad');
	};
	rec.onend = () => {
		if (voice.rec !== rec) return;
		voice.rec = null;
		if (!voice.on) return;
		const quick = !voice.gotResult && performance.now() - voice.startedAt < 1500;
		voice.quickEnds = quick ? voice.quickEnds + 1 : 0;
		voice.restart = setTimeout(voiceStart, quick ? Math.min(8000, 250 * 2 ** voice.quickEnds) : 60);
	};
	try {
		rec.start();
	} catch (err) {
		voice.rec = null;
		voice.restart = setTimeout(voiceStart, 500);
	}
}
function onVoiceResult(e, rec) {
	voice.gotResult = true;
	for (let i = e.resultIndex; i < e.results.length; i++) {
		const r = e.results[i];
		const alts = [];
		for (let j = 0; j < r.length; j++) alts.push(String(r[j].transcript || '').trim());
		const text = alts[0] || '';
		if (!text) continue;
		let cmd = null;
		for (const a of alts) if ((cmd = parseVoice(a))) break;
		const prev = voice.fired.get(i);
		clearTimeout(voice.steady);
		const same = (a, b) => a && b && JSON.stringify(a) === JSON.stringify(b);
		if (r.isFinal) {
			if (cmd && !same(prev, cmd)) voiceDo(cmd, text);
			else if (!cmd && !prev) voiceStatus(`“${text}” isn’t a command`);
			voice.fired.set(i, cmd || prev || { none: true });
		} else if (!prev) {
			voiceStatus(`“${text}”…`);
			if (cmd)
				voice.steady = setTimeout(() => {
					if (voice.rec === rec && !voice.fired.has(i)) {
						voice.fired.set(i, cmd);
						voiceDo(cmd, text);
					}
				}, 350);
		}
	}
}
function voiceDo(cmd, text) {
	if (pendingConfirm) return;
	let what;
	if (cmd.area) {
		frameArea(cmd.area);
		what = AREAS[cmd.area].label;
	} else if (cmd.country) {
		const c = BY_ID.get(cmd.country);
		if (S.namesAnswer && session && !review && state.mode !== 'study') {
			voiceStatus(`“${text}”: country names aren’t commands during a quiz here`, 'bad');
			return;
		}
		state.zoomArea = null;
		renderZoom();
		flyTo(camForCountry(c));
		what = c.name;
	} else if (cmd.view) {
		setView(cmd.view);
		what = cmd.view === 'globe' ? 'Globe' : 'Flat map';
	} else if (cmd.zoom === 'in') {
		const f = free();
		zoomAround(f.cx, f.cy, 1.8);
		what = 'Zoom in';
	} else {
		frameRegion();
		what = regionLabel();
	}
	voiceStatus(`“${text}” → ${what}`, 'ok');
	if (state.clean || narrow()) toast(what);
}
$('voiceBtn').addEventListener('click', () => setVoice(!voice.on));
// names of oceans, seas, lakes and rivers on the map: on/off (L)
function setNames(on, announce) {
	state.names = on;
	store.set('waterNames', on);
	$('namesBtn').setAttribute('aria-pressed', String(on));
	invalidate();
	if (announce) toast(on ? t('names_on') : t('names_off'));
}
$('namesBtn').setAttribute('aria-pressed', String(state.names));
$('namesBtn').addEventListener('click', () => setNames(!state.names));
document.addEventListener('visibilitychange', () => {
	if (!document.hidden && voice.on && !voice.rec) voiceStart();
});

/* ---------------- language ---------------- */
// The page's start-up script (index.html) picked the language: a ?lang= link, then the one saved for this tool (or
// for one of the other two), then the browser's languages, then English. The setting changes it.
const LANG_DIR = '../capital-atlas/lang/';
const LANG_CODES = new Set(LANGS.map((l) => l[0]));
const langFiles = new Map();
const fetchLang = (code) => {
	if (!langFiles.has(code))
		langFiles.set(code, window.__offlineFetchCap(LANG_DIR + code + '.json').then((r) => {
			if (!r.ok) throw new Error('HTTP ' + r.status);
			return r.json();
		}));
	return langFiles.get(code);
};
// voice understands English place names only, so it is offered in English
const voiceOffered = () => lang() === 'en';
// Fixed text in the page carries data-i18n keys; everything drawn by script is drawn again.
const creditLinks = {};
function applyStatic() {
	for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
	for (const el of document.querySelectorAll('[data-i18n-title]')) el.title = t(el.dataset.i18nTitle);
	for (const el of document.querySelectorAll('[data-i18n-aria]')) el.setAttribute('aria-label', t(el.dataset.i18nAria));
	for (const el of document.querySelectorAll('[data-i18n-ph]')) el.placeholder = t(el.dataset.i18nPh);
	// the credit line: its links kept, the words around them in the language in use
	const credit = document.querySelector('.credit');
	if (!Object.keys(creditLinks).length)
		for (const a of credit.querySelectorAll('a')) {
			const h = a.getAttribute('href');
			creditLinks[h.includes('naturalearth') ? 'ne' : h.includes('country-flags') ? 'cf' : 'fi'] = a.outerHTML;
		}
	credit.innerHTML = t('credit', creditLinks) + (lang() === 'en' ? '' : ' ' + t('names_credit'));
	// "Deutsch (German)": a language's own name, then its name in the language in use
	for (const o of $('langSel').options) {
		const here = langName(o.value), own = o.dataset.own;
		o.textContent = !here || here.toLowerCase() === own.toLowerCase() ? own : `${own} (${here})`;
	}
	$('langSel').value = lang();
	const own = LANGS.find((l) => l[0] === lang())[1];
	$('langNote').textContent = hasUi() ? '' : t('lang_note', { lang: own });
	$('langNote').hidden = hasUi();
	$('voiceBtn').hidden = !voiceOffered();
	if (!voiceOffered() && voice.on) setVoice(false);
}
function useLanguage(code, data) {
	setLanguage(code, data);
	const l = LANGS.find((x) => x[0] === code);
	document.documentElement.lang = hasUi() ? l[2] : 'en';
	if (COUNTRIES.length) checkAnswer = makeChecker(S, COUNTRIES);
}
async function setLang(code) {
	if (!LANG_CODES.has(code) || code === lang()) return;
	let data;
	try {
		data = await fetchLang(code);
	} catch (e) {
		toast('That language didn’t load. Check your connection and try again.', 'bad');
		$('langSel').value = lang();
		return;
	}
	useLanguage(code, data);
	store.set('lang', code);
	try {
		localStorage.setItem('todologo.lang', code);
		localStorage.setItem('ss1.capital-atlas.lang', JSON.stringify(code));
		localStorage.setItem('ss1.country-atlas.lang', JSON.stringify(code));
		localStorage.setItem('ss1.flag-atlas.lang', JSON.stringify(code));
		localStorage.setItem('ss1.state-atlas.lang', JSON.stringify(code));
	} catch (e) {}
	applyStatic();
	renderRail();
	renderZoom();
	renderAll();
	if (callout) {
		const c = BY_ID.get(callout.id);
		if (c && !review) calloutFor(c);
		else if (c) setCallout(c.id, S.callout(c).title, S.callout(c).sub, S.callout(c).flag);
	}
	$('search').dispatchEvent(new Event('input'));
	baseDirty = true;
	invalidate();
	resize();
}
$('langSel').replaceChildren(
	...LANGS.map(([code, own], i) => {
		const o = document.createElement('option');
		o.value = code;
		o.textContent = own;
		o.dataset.own = own;
		o.lang = LANGS[i][2];
		return o;
	}),
);
$('langSel').addEventListener('change', (e) => setLang(e.target.value));

/* ---------------- sizing ---------------- */
function resize() {
	const ins = measureInsets();
	const sizeChanged = ins.w !== layout.w || ins.h !== layout.h;
	const sameArea = !sizeChanged && ['top', 'bottom', 'left', 'right'].every((k) => Math.abs(ins[k] - layout[k]) < 1);
	Object.assign(layout, ins);
	if (sizeChanged) sizeCanvases();
	fitName();
	if (sameArea) return;
	computeMapBase();
	constrain();
	updateProj();
	if (sizeChanged && COUNTRIES.length) {
		// setting a canvas's size wipes it: draw again straight away so nothing blinks
		baseDirty = false;
		drawBase();
		drawFx(performance.now());
	}
	invalidate();
}
window.addEventListener('resize', resize);
if (window.ResizeObserver) {
	let r = 0;
	const ro = new ResizeObserver(() => {
		cancelAnimationFrame(r);
		r = requestAnimationFrame(resize);
	});
	['prompt', 'rail', 'viewCard', 'panel'].forEach((id) => ro.observe($(id)));
	ro.observe(document.querySelector('.dock'));
}

/* ---------------- boot ---------------- */
async function boot() {
	const bar = $('loadBar');
	let code = LANG_CODES.has(window.__geoLang) ? window.__geoLang : 'es';
	const langData = fetchLang(code).catch(() => ((code = 'es'), fetchLang('es').catch(() => null)));
	const [countries, xlow, words] = await Promise.all([
		window.__offlineFetchCap(DATA + 'countries.json').then((r) => {
			if (!r.ok) throw new Error('HTTP ' + r.status);
			return r.json();
		}),
		window.__offlineFetchCap(DATA + 'map-xlow.json').then((r) => {
			if (!r.ok) throw new Error('HTTP ' + r.status);
			return r.json();
		}),
		langData,
	]);
	bar.value = 0.8;
	COUNTRIES = countries;
	for (const c of COUNTRIES) BY_ID.set(c.id, c);
	useLanguage(code, words);
	applyStatic();
	LOD.xlow = useTopology(xlow);
	buildMeta(LOD.xlow);
	buildVoice();
	renderRail();
	renderZoom();
	renderSegs();
	resize();
	Object.assign(cam, camForBox(AREAS[state.region].box));
	state.zoomArea = state.region;
	renderZoom();
	updateProj();
	$('loading').hidden = true;
	startSession();
	if (state.pins) loadPins();
	loadWater('low').catch(() => {});
	loadSeas().catch(() => {});
	// more detail in the background
	const more = (name) =>
		window.__offlineFetchCap(`${DATA}map-${name}.json`)
			.then((r) => r.json())
			.then((t) => {
				LOD[name] = useTopology(t);
				invalidate();
			});
	more('low')
		.then(() => more('mid'))
		.then(() => refreshMeta(LOD.mid))
		.catch(() => {});
	if (location.hash === '#selftest') {
		window.__capitalAtlas = {
			state, cam, COUNTRIES, BY_ID, META, LOD, pickAt, setView, setMode, setFormat, startSession, submitAnswer, onMapClick, frameArea,
			parseVoice, checkAnswer, free, getSession: () => session, getStudy: () => study, getReview: () => review, project: (ll) => projectPoint(proj, ll),
			camForCountry, screen, geoContains, bestFeats, waterAt, WATER, webZoom, getHoverIdx: () => hoverIdx, targetId, S,
			PINS, iconLL, setPins, removePin, setPinSize, pinRects: () => pinRects, loadPins, landMiddle,
			pinFromUrl: (url, id) => pinPicture(urlImage(url), id),
			prof: (c, fast) => {
				Object.assign(cam, c);
				constrain();
				updateProj();
				moving = !!fast;
				slowDevice = !!fast;
				const t0 = performance.now();
				drawBase();
				const t1 = performance.now();
				drawFx(performance.now());
				const t2 = performance.now();
				// path building alone, no pixels
				const nul = { beginPath() {}, moveTo() {}, lineTo() {}, closePath() {}, arc() {} };
				const pth = geoPath(proj, nul), feats = LOD[lodName(proj)];
				const vis = visibleIndices(proj);
				let pts = 0;
				for (const i of vis) eachPoint(feats[i].geometry, () => pts++);
				for (const i of vis) pth(feats[i]);
				const t3 = performance.now();
				const r = { base: t1 - t0, fx: t2 - t1, pathOnly: t3 - t2, lod: lodName(proj), vis: vis.length, pts };
				moving = false;
				return r;
			},
			setCam: (c) => {
				Object.assign(cam, c);
				constrain();
				updateProj();
				drawBase();
				drawFx(performance.now());
			},
			flyNow: () => {
				if (fly) {
					fly.t0 = -1e9;
					stepFly(performance.now());
				}
			},
		};
	}
}
boot().catch((err) => {
	console.error(err);
	$('loadMsg').textContent = t('load_fail');
});

})();
})();
