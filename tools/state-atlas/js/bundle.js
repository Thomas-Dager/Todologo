(function(){
const __GEO = (function(){
/* d3-geo and topojson-client by Mike Bostock (ISC license), bundled for Capital Atlas */
var D=class{constructor(){this._partials=new Float64Array(32),this._n=0}add(n){let e=this._partials,r=0;for(let o=0;o<this._n&&o<32;o++){let i=e[o],u=n+i,l=Math.abs(n)<Math.abs(i)?n-(u-i):i-(u-n);l&&(e[r++]=l),n=u}return e[r]=n,this._n=r+1,this}valueOf(){let n=this._partials,e=this._n,r,o,i,u=0;if(e>0){for(u=n[--e];e>0&&(r=u,o=n[--e],u=r+o,i=o-(u-r),!i););e>0&&(i<0&&n[e-1]<0||i>0&&n[e-1]>0)&&(o=i*2,r=u+o,o==r-u&&(u=r))}return u}};function*$e(t){for(let n of t)yield*n}function At(t){return Array.from($e(t))}function dt(t,n,e){t=+t,n=+n,e=(o=arguments.length)<2?(n=t,t=0,1):o<3?1:+e;for(var r=-1,o=Math.max(0,Math.ceil((n-t)/e))|0,i=new Array(o);++r<o;)i[r]=t+r*e;return i}var P=1e-6,yt=1e-12,I=Math.PI,J=I/2,Ct=I/4,W=I*2,F=180/I,y=I/180,q=Math.abs,vr=Math.atan,Z=Math.atan2,S=Math.cos,$t=Math.ceil;var nn=Math.hypot;var x=Math.sin,xr=Math.sign||function(t){return t>0?1:t<0?-1:0},X=Math.sqrt;function Er(t){return t>1?0:t<-1?I:Math.acos(t)}function j(t){return t>1?J:t<-1?-J:Math.asin(t)}function Ln(t){return(t=x(t/2))*t}function z(){}function rn(t,n){t&&Sr.hasOwnProperty(t.type)&&Sr[t.type](t,n)}var yr={Feature:function(t,n){rn(t.geometry,n)},FeatureCollection:function(t,n){for(var e=t.features,r=-1,o=e.length;++r<o;)rn(e[r].geometry,n)}},Sr={Sphere:function(t,n){n.sphere()},Point:function(t,n){t=t.coordinates,n.point(t[0],t[1],t[2])},MultiPoint:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)t=e[r],n.point(t[0],t[1],t[2])},LineString:function(t,n){zn(t.coordinates,n,0)},MultiLineString:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)zn(e[r],n,0)},Polygon:function(t,n){wr(t.coordinates,n)},MultiPolygon:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)wr(e[r],n)},GeometryCollection:function(t,n){for(var e=t.geometries,r=-1,o=e.length;++r<o;)rn(e[r],n)}};function zn(t,n,e){var r=-1,o=t.length-e,i;for(n.lineStart();++r<o;)i=t[r],n.point(i[0],i[1],i[2]);n.lineEnd()}function wr(t,n){var e=-1,r=t.length;for(n.polygonStart();++e<r;)zn(t[e],n,1);n.polygonEnd()}function U(t,n){t&&yr.hasOwnProperty(t.type)?yr[t.type](t,n):rn(t,n)}var Dt=new D,en=new D,Pr,Mr,_n,Gn,Fn,at={point:z,lineStart:z,lineEnd:z,polygonStart:function(){Dt=new D,at.lineStart=De,at.lineEnd=ke},polygonEnd:function(){var t=+Dt;en.add(t<0?W+t:t),this.lineStart=this.lineEnd=this.point=z},sphere:function(){en.add(W)}};function De(){at.point=Be}function ke(){Rr(Pr,Mr)}function Be(t,n){at.point=Rr,Pr=t,Mr=n,t*=y,n*=y,_n=t,Gn=S(n=n/2+Ct),Fn=x(n)}function Rr(t,n){t*=y,n*=y,n=n/2+Ct;var e=t-_n,r=e>=0?1:-1,o=r*e,i=S(n),u=x(n),l=Fn*u,m=Gn*i+l*S(o),p=l*r*x(o);Dt.add(Z(p,m)),_n=t,Gn=i,Fn=u}function Ar(t){return en=new D,U(t,at),en*2}function St(t){return[Z(t[1],t[0]),j(t[2])]}function it(t){var n=t[0],e=t[1],r=S(e);return[r*S(n),r*x(n),x(e)]}function kt(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]}function mt(t,n){return[t[1]*n[2]-t[2]*n[1],t[2]*n[0]-t[0]*n[2],t[0]*n[1]-t[1]*n[0]]}function on(t,n){t[0]+=n[0],t[1]+=n[1],t[2]+=n[2]}function Bt(t,n){return[t[0]*n,t[1]*n,t[2]*n]}function wt(t){var n=X(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);t[0]/=n,t[1]/=n,t[2]/=n}var B,nt,Y,et,Pt,Ir,Lr,qt,Xt,vt,gt,ht={point:Tn,lineStart:Cr,lineEnd:qr,polygonStart:function(){ht.point=_r,ht.lineStart=Xe,ht.lineEnd=Ye,Xt=new D,at.polygonStart()},polygonEnd:function(){at.polygonEnd(),ht.point=Tn,ht.lineStart=Cr,ht.lineEnd=qr,Dt<0?(B=-(Y=180),nt=-(et=90)):Xt>P?et=90:Xt<-P&&(nt=-90),gt[0]=B,gt[1]=Y},sphere:function(){B=-(Y=180),nt=-(et=90)}};function Tn(t,n){vt.push(gt=[B=t,Y=t]),n<nt&&(nt=n),n>et&&(et=n)}function zr(t,n){var e=it([t*y,n*y]);if(qt){var r=mt(qt,e),o=[r[1],-r[0],0],i=mt(o,r);wt(i),i=St(i);var u=t-Pt,l=u>0?1:-1,m=i[0]*F*l,p,a=q(u)>180;a^(l*Pt<m&&m<l*t)?(p=i[1]*F,p>et&&(et=p)):(m=(m+360)%360-180,a^(l*Pt<m&&m<l*t)?(p=-i[1]*F,p<nt&&(nt=p)):(n<nt&&(nt=n),n>et&&(et=n))),a?t<Pt?rt(B,t)>rt(B,Y)&&(Y=t):rt(t,Y)>rt(B,Y)&&(B=t):Y>=B?(t<B&&(B=t),t>Y&&(Y=t)):t>Pt?rt(B,t)>rt(B,Y)&&(Y=t):rt(t,Y)>rt(B,Y)&&(B=t)}else vt.push(gt=[B=t,Y=t]);n<nt&&(nt=n),n>et&&(et=n),qt=e,Pt=t}function Cr(){ht.point=zr}function qr(){gt[0]=B,gt[1]=Y,ht.point=Tn,qt=null}function _r(t,n){if(qt){var e=t-Pt;Xt.add(q(e)>180?e+(e>0?360:-360):e)}else Ir=t,Lr=n;at.point(t,n),zr(t,n)}function Xe(){at.lineStart()}function Ye(){_r(Ir,Lr),at.lineEnd(),q(Xt)>P&&(B=-(Y=180)),gt[0]=B,gt[1]=Y,qt=null}function rt(t,n){return(n-=t)<0?n+360:n}function Oe(t,n){return t[0]-n[0]}function Nr(t,n){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}function Gr(t){var n,e,r,o,i,u,l;if(et=Y=-(B=nt=1/0),vt=[],U(t,ht),e=vt.length){for(vt.sort(Oe),n=1,r=vt[0],i=[r];n<e;++n)o=vt[n],Nr(r,o[0])||Nr(r,o[1])?(rt(r[0],o[1])>rt(r[0],r[1])&&(r[1]=o[1]),rt(o[0],r[1])>rt(r[0],r[1])&&(r[0]=o[0])):i.push(r=o);for(u=-1/0,e=i.length-1,n=0,r=i[e];n<=e;r=o,++n)o=i[n],(l=rt(r[1],o[0]))>u&&(u=l,B=o[0],Y=r[1])}return vt=gt=null,B===1/0||nt===1/0?[[NaN,NaN],[NaN,NaN]]:[[B,nt],[Y,et]]}var Yt,an,fn,un,ln,sn,cn,pn,$n,Dn,kn,$r,Dr,K,Q,V,ft={sphere:z,point:Bn,lineStart:Fr,lineEnd:Tr,polygonStart:function(){ft.lineStart=He,ft.lineEnd=je},polygonEnd:function(){ft.lineStart=Fr,ft.lineEnd=Tr}};function Bn(t,n){t*=y,n*=y;var e=S(n);Ot(e*S(t),e*x(t),x(n))}function Ot(t,n,e){++Yt,fn+=(t-fn)/Yt,un+=(n-un)/Yt,ln+=(e-ln)/Yt}function Fr(){ft.point=Ze}function Ze(t,n){t*=y,n*=y;var e=S(n);K=e*S(t),Q=e*x(t),V=x(n),ft.point=We,Ot(K,Q,V)}function We(t,n){t*=y,n*=y;var e=S(n),r=e*S(t),o=e*x(t),i=x(n),u=Z(X((u=Q*i-V*o)*u+(u=V*r-K*i)*u+(u=K*o-Q*r)*u),K*r+Q*o+V*i);an+=u,sn+=u*(K+(K=r)),cn+=u*(Q+(Q=o)),pn+=u*(V+(V=i)),Ot(K,Q,V)}function Tr(){ft.point=Bn}function He(){ft.point=Ue}function je(){kr($r,Dr),ft.point=Bn}function Ue(t,n){$r=t,Dr=n,t*=y,n*=y,ft.point=kr;var e=S(n);K=e*S(t),Q=e*x(t),V=x(n),Ot(K,Q,V)}function kr(t,n){t*=y,n*=y;var e=S(n),r=e*S(t),o=e*x(t),i=x(n),u=Q*i-V*o,l=V*r-K*i,m=K*o-Q*r,p=nn(u,l,m),a=j(p),f=p&&-a/p;$n.add(f*u),Dn.add(f*l),kn.add(f*m),an+=a,sn+=a*(K+(K=r)),cn+=a*(Q+(Q=o)),pn+=a*(V+(V=i)),Ot(K,Q,V)}function Br(t){Yt=an=fn=un=ln=sn=cn=pn=0,$n=new D,Dn=new D,kn=new D,U(t,ft);var n=+$n,e=+Dn,r=+kn,o=nn(n,e,r);return o<yt&&(n=sn,e=cn,r=pn,an<P&&(n=fn,e=un,r=ln),o=nn(n,e,r),o<yt)?[NaN,NaN]:[Z(e,n)*F,j(r/o)*F]}function Zt(t,n){function e(r,o){return r=t(r,o),n(r[0],r[1])}return t.invert&&n.invert&&(e.invert=function(r,o){return r=n.invert(r,o),r&&t.invert(r[0],r[1])}),e}function Xn(t,n){return q(t)>I&&(t-=Math.round(t/W)*W),[t,n]}Xn.invert=Xn;function Yn(t,n,e){return(t%=W)?n||e?Zt(Yr(t),Or(n,e)):Yr(t):n||e?Or(n,e):Xn}function Xr(t){return function(n,e){return n+=t,q(n)>I&&(n-=Math.round(n/W)*W),[n,e]}}function Yr(t){var n=Xr(t);return n.invert=Xr(-t),n}function Or(t,n){var e=S(t),r=x(t),o=S(n),i=x(n);function u(l,m){var p=S(m),a=S(l)*p,f=x(l)*p,s=x(m),c=s*e+a*r;return[Z(f*o-c*i,a*e-s*r),j(c*o+f*i)]}return u.invert=function(l,m){var p=S(m),a=S(l)*p,f=x(l)*p,s=x(m),c=s*o-f*i;return[Z(f*o+s*i,a*e+c*r),j(c*e-a*r)]},u}function Zr(t){t=Yn(t[0]*y,t[1]*y,t.length>2?t[2]*y:0);function n(e){return e=t(e[0]*y,e[1]*y),e[0]*=F,e[1]*=F,e}return n.invert=function(e){return e=t.invert(e[0]*y,e[1]*y),e[0]*=F,e[1]*=F,e},n}function Hr(t,n,e,r,o,i){if(e){var u=S(n),l=x(n),m=r*e;o==null?(o=n+r*W,i=n-m/2):(o=Wr(u,o),i=Wr(u,i),(r>0?o<i:o>i)&&(o+=r*W));for(var p,a=o;r>0?a>i:a<i;a-=m)p=St([u,-l*S(a),-l*x(a)]),t.point(p[0],p[1])}}function Wr(t,n){n=it(n),n[0]-=t,wt(n);var e=Er(-n[1]);return((-n[2]<0?-e:e)+W-P)%W}function dn(){var t=[],n;return{point:function(e,r,o){n.push([e,r,o])},lineStart:function(){t.push(n=[])},lineEnd:z,rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))},result:function(){var e=t;return t=[],n=null,e}}}function Nt(t,n){return q(t[0]-n[0])<P&&q(t[1]-n[1])<P}function mn(t,n,e,r){this.x=t,this.z=n,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}function hn(t,n,e,r,o){var i=[],u=[],l,m;if(t.forEach(function(d){if(!((M=d.length-1)<=0)){var M,v=d[0],E=d[M],R;if(Nt(v,E)){if(!v[2]&&!E[2]){for(o.lineStart(),l=0;l<M;++l)o.point((v=d[l])[0],v[1]);o.lineEnd();return}E[0]+=2*P}i.push(R=new mn(v,d,null,!0)),u.push(R.o=new mn(v,null,R,!1)),i.push(R=new mn(E,d,null,!1)),u.push(R.o=new mn(E,null,R,!0))}}),!!i.length){for(u.sort(n),jr(i),jr(u),l=0,m=u.length;l<m;++l)u[l].e=e=!e;for(var p=i[0],a,f;;){for(var s=p,c=!0;s.v;)if((s=s.n)===p)return;a=s.z,o.lineStart();do{if(s.v=s.o.v=!0,s.e){if(c)for(l=0,m=a.length;l<m;++l)o.point((f=a[l])[0],f[1]);else r(s.x,s.n.x,1,o);s=s.n}else{if(c)for(a=s.p.z,l=a.length-1;l>=0;--l)o.point((f=a[l])[0],f[1]);else r(s.x,s.p.x,-1,o);s=s.p}s=s.o,a=s.z,c=!c}while(!s.v);o.lineEnd()}}}function jr(t){if(n=t.length){for(var n,e=0,r=t[0],o;++e<n;)r.n=o=t[e],o.p=r,r=o;r.n=o=t[0],o.p=r}}function On(t){return q(t[0])<=I?t[0]:xr(t[0])*((q(t[0])+I)%W-I)}function gn(t,n){var e=On(n),r=n[1],o=x(r),i=[x(e),-S(e),0],u=0,l=0,m=new D;o===1?r=J+P:o===-1&&(r=-J-P);for(var p=0,a=t.length;p<a;++p)if(s=(f=t[p]).length)for(var f,s,c=f[s-1],d=On(c),M=c[1]/2+Ct,v=x(M),E=S(M),R=0;R<s;++R,d=w,v=N,E=T,c=g){var g=f[R],w=On(g),A=g[1]/2+Ct,N=x(A),T=S(A),_=w-d,G=_>=0?1:-1,k=G*_,C=k>I,b=v*N;if(m.add(Z(b*G*x(k),E*T+b*S(k))),u+=C?_+G*W:_,C^d>=e^w>=e){var O=mt(it(c),it(g));wt(O);var $=mt(i,O);wt($);var h=(C^_>=0?-1:1)*j($[2]);(r>h||r===h&&(O[0]||O[1]))&&(l+=C^_>=0?1:-1)}}return(u<-P||u<P&&m<-yt)^l&1}function vn(t,n,e,r){return function(o){var i=n(o),u=dn(),l=n(u),m=!1,p,a,f,s={point:c,lineStart:M,lineEnd:v,polygonStart:function(){s.point=E,s.lineStart=R,s.lineEnd=g,a=[],p=[]},polygonEnd:function(){s.point=c,s.lineStart=M,s.lineEnd=v,a=At(a);var w=gn(p,r);a.length?(m||(o.polygonStart(),m=!0),hn(a,Ke,w,e,o)):w&&(m||(o.polygonStart(),m=!0),o.lineStart(),e(null,null,1,o),o.lineEnd()),m&&(o.polygonEnd(),m=!1),a=p=null},sphere:function(){o.polygonStart(),o.lineStart(),e(null,null,1,o),o.lineEnd(),o.polygonEnd()}};function c(w,A){t(w,A)&&o.point(w,A)}function d(w,A){i.point(w,A)}function M(){s.point=d,i.lineStart()}function v(){s.point=c,i.lineEnd()}function E(w,A){f.push([w,A]),l.point(w,A)}function R(){l.lineStart(),f=[]}function g(){E(f[0][0],f[0][1]),l.lineEnd();var w=l.clean(),A=u.result(),N,T=A.length,_,G,k;if(f.pop(),p.push(f),f=null,!!T){if(w&1){if(G=A[0],(_=G.length-1)>0){for(m||(o.polygonStart(),m=!0),o.lineStart(),N=0;N<_;++N)o.point((k=G[N])[0],k[1]);o.lineEnd()}return}T>1&&w&2&&A.push(A.pop().concat(A.shift())),a.push(A.filter(Je))}}return s}}function Je(t){return t.length>1}function Ke(t,n){return((t=t.x)[0]<0?t[1]-J-P:J-t[1])-((n=n.x)[0]<0?n[1]-J-P:J-n[1])}var Zn=vn(function(){return!0},Qe,be,[-I,-J]);function Qe(t){var n=NaN,e=NaN,r=NaN,o;return{lineStart:function(){t.lineStart(),o=1},point:function(i,u){var l=i>0?I:-I,m=q(i-n);q(m-I)<P?(t.point(n,e=(e+u)/2>0?J:-J),t.point(r,e),t.lineEnd(),t.lineStart(),t.point(l,e),t.point(i,e),o=0):r!==l&&m>=I&&(q(n-r)<P&&(n-=r*P),q(i-l)<P&&(i-=l*P),e=Ve(n,e,i,u),t.point(r,e),t.lineEnd(),t.lineStart(),t.point(l,e),o=0),t.point(n=i,e=u),r=l},lineEnd:function(){t.lineEnd(),n=e=NaN},clean:function(){return 2-o}}}function Ve(t,n,e,r){var o,i,u=x(t-e);return q(u)>P?vr((x(n)*(i=S(r))*x(e)-x(r)*(o=S(n))*x(t))/(o*i*u)):(n+r)/2}function be(t,n,e,r){var o;if(t==null)o=e*J,r.point(-I,o),r.point(0,o),r.point(I,o),r.point(I,0),r.point(I,-o),r.point(0,-o),r.point(-I,-o),r.point(-I,0),r.point(-I,o);else if(q(t[0]-n[0])>P){var i=t[0]<n[0]?I:-I;o=e*i/2,r.point(-i,o),r.point(0,o),r.point(i,o)}else r.point(n[0],n[1])}function Ur(t){var n=S(t),e=2*y,r=n>0,o=q(n)>P;function i(a,f,s,c){Hr(c,t,e,s,a,f)}function u(a,f){return S(a)*S(f)>n}function l(a){var f,s,c,d,M;return{lineStart:function(){d=c=!1,M=1},point:function(v,E){var R=[v,E],g,w=u(v,E),A=r?w?0:p(v,E):w?p(v+(v<0?I:-I),E):0;if(!f&&(d=c=w)&&a.lineStart(),w!==c&&(g=m(f,R),(!g||Nt(f,g)||Nt(R,g))&&(R[2]=1)),w!==c)M=0,w?(a.lineStart(),g=m(R,f),a.point(g[0],g[1])):(g=m(f,R),a.point(g[0],g[1],2),a.lineEnd()),f=g;else if(o&&f&&r^w){var N;!(A&s)&&(N=m(R,f,!0))&&(M=0,r?(a.lineStart(),a.point(N[0][0],N[0][1]),a.point(N[1][0],N[1][1]),a.lineEnd()):(a.point(N[1][0],N[1][1]),a.lineEnd(),a.lineStart(),a.point(N[0][0],N[0][1],3)))}w&&(!f||!Nt(f,R))&&a.point(R[0],R[1]),f=R,c=w,s=A},lineEnd:function(){c&&a.lineEnd(),f=null},clean:function(){return M|(d&&c)<<1}}}function m(a,f,s){var c=it(a),d=it(f),M=[1,0,0],v=mt(c,d),E=kt(v,v),R=v[0],g=E-R*R;if(!g)return!s&&a;var w=n*E/g,A=-n*R/g,N=mt(M,v),T=Bt(M,w),_=Bt(v,A);on(T,_);var G=N,k=kt(T,G),C=kt(G,G),b=k*k-C*(kt(T,T)-1);if(!(b<0)){var O=X(b),$=Bt(G,(-k-O)/C);if(on($,T),$=St($),!s)return $;var h=a[0],L=f[0],H=a[1],tt=f[1],ot;L<h&&(ot=h,h=L,L=ot);var Tt=L-h,ct=q(Tt-I)<P,Et=ct||Tt<P;if(!ct&&tt<H&&(ot=H,H=tt,tt=ot),Et?ct?H+tt>0^$[1]<(q($[0]-h)<P?H:tt):H<=$[1]&&$[1]<=tt:Tt>I^(h<=$[0]&&$[0]<=L)){var pt=Bt(G,(-k+O)/C);return on(pt,T),[$,St(pt)]}}}function p(a,f){var s=r?t:I-t,c=0;return a<-s?c|=1:a>s&&(c|=2),f<-s?c|=4:f>s&&(c|=8),c}return vn(u,l,i,r?[0,-t]:[-I,t-I])}function Jr(t,n,e,r,o,i){var u=t[0],l=t[1],m=n[0],p=n[1],a=0,f=1,s=m-u,c=p-l,d;if(d=e-u,!(!s&&d>0)){if(d/=s,s<0){if(d<a)return;d<f&&(f=d)}else if(s>0){if(d>f)return;d>a&&(a=d)}if(d=o-u,!(!s&&d<0)){if(d/=s,s<0){if(d>f)return;d>a&&(a=d)}else if(s>0){if(d<a)return;d<f&&(f=d)}if(d=r-l,!(!c&&d>0)){if(d/=c,c<0){if(d<a)return;d<f&&(f=d)}else if(c>0){if(d>f)return;d>a&&(a=d)}if(d=i-l,!(!c&&d<0)){if(d/=c,c<0){if(d>f)return;d>a&&(a=d)}else if(c>0){if(d<a)return;d<f&&(f=d)}return a>0&&(t[0]=u+a*s,t[1]=l+a*c),f<1&&(n[0]=u+f*s,n[1]=l+f*c),!0}}}}}var Wt=1e9,xn=-Wt;function Wn(t,n,e,r){function o(p,a){return t<=p&&p<=e&&n<=a&&a<=r}function i(p,a,f,s){var c=0,d=0;if(p==null||(c=u(p,f))!==(d=u(a,f))||m(p,a)<0^f>0)do s.point(c===0||c===3?t:e,c>1?r:n);while((c=(c+f+4)%4)!==d);else s.point(a[0],a[1])}function u(p,a){return q(p[0]-t)<P?a>0?0:3:q(p[0]-e)<P?a>0?2:1:q(p[1]-n)<P?a>0?1:0:a>0?3:2}function l(p,a){return m(p.x,a.x)}function m(p,a){var f=u(p,1),s=u(a,1);return f!==s?f-s:f===0?a[1]-p[1]:f===1?p[0]-a[0]:f===2?p[1]-a[1]:a[0]-p[0]}return function(p){var a=p,f=dn(),s,c,d,M,v,E,R,g,w,A,N,T={point:_,lineStart:b,lineEnd:O,polygonStart:k,polygonEnd:C};function _(h,L){o(h,L)&&a.point(h,L)}function G(){for(var h=0,L=0,H=c.length;L<H;++L)for(var tt=c[L],ot=1,Tt=tt.length,ct=tt[0],Et,pt,tn=ct[0],Rt=ct[1];ot<Tt;++ot)Et=tn,pt=Rt,ct=tt[ot],tn=ct[0],Rt=ct[1],pt<=r?Rt>r&&(tn-Et)*(r-pt)>(Rt-pt)*(t-Et)&&++h:Rt<=r&&(tn-Et)*(r-pt)<(Rt-pt)*(t-Et)&&--h;return h}function k(){a=f,s=[],c=[],N=!0}function C(){var h=G(),L=N&&h,H=(s=At(s)).length;(L||H)&&(p.polygonStart(),L&&(p.lineStart(),i(null,null,1,p),p.lineEnd()),H&&hn(s,l,h,i,p),p.polygonEnd()),a=p,s=c=d=null}function b(){T.point=$,c&&c.push(d=[]),A=!0,w=!1,R=g=NaN}function O(){s&&($(M,v),E&&w&&f.rejoin(),s.push(f.result())),T.point=_,w&&a.lineEnd()}function $(h,L){var H=o(h,L);if(c&&d.push([h,L]),A)M=h,v=L,E=H,A=!1,H&&(a.lineStart(),a.point(h,L));else if(H&&w)a.point(h,L);else{var tt=[R=Math.max(xn,Math.min(Wt,R)),g=Math.max(xn,Math.min(Wt,g))],ot=[h=Math.max(xn,Math.min(Wt,h)),L=Math.max(xn,Math.min(Wt,L))];Jr(tt,ot,t,n,e,r)?(w||(a.lineStart(),a.point(tt[0],tt[1])),a.point(ot[0],ot[1]),H||a.lineEnd(),N=!1):H&&(a.lineStart(),a.point(h,L),N=!1)}R=h,g=L,w=H}return T}}var Hn,jn,En,yn,It={sphere:z,point:z,lineStart:to,lineEnd:z,polygonStart:z,polygonEnd:z};function to(){It.point=ro,It.lineEnd=no}function no(){It.point=It.lineEnd=z}function ro(t,n){t*=y,n*=y,jn=t,En=x(n),yn=S(n),It.point=eo}function eo(t,n){t*=y,n*=y;var e=x(n),r=S(n),o=q(t-jn),i=S(o),u=x(o),l=r*u,m=yn*e-En*r*i,p=En*e+yn*r*i;Hn.add(Z(X(l*l+m*m),p)),jn=t,En=e,yn=r}function Kr(t){return Hn=new D,U(t,It),+Hn}var Un=[null,null],oo={type:"LineString",coordinates:Un};function Lt(t,n){return Un[0]=t,Un[1]=n,Kr(oo)}var Qr={Feature:function(t,n){return Sn(t.geometry,n)},FeatureCollection:function(t,n){for(var e=t.features,r=-1,o=e.length;++r<o;)if(Sn(e[r].geometry,n))return!0;return!1}},Vr={Sphere:function(){return!0},Point:function(t,n){return br(t.coordinates,n)},MultiPoint:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)if(br(e[r],n))return!0;return!1},LineString:function(t,n){return te(t.coordinates,n)},MultiLineString:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)if(te(e[r],n))return!0;return!1},Polygon:function(t,n){return ne(t.coordinates,n)},MultiPolygon:function(t,n){for(var e=t.coordinates,r=-1,o=e.length;++r<o;)if(ne(e[r],n))return!0;return!1},GeometryCollection:function(t,n){for(var e=t.geometries,r=-1,o=e.length;++r<o;)if(Sn(e[r],n))return!0;return!1}};function Sn(t,n){return t&&Vr.hasOwnProperty(t.type)?Vr[t.type](t,n):!1}function br(t,n){return Lt(t,n)===0}function te(t,n){for(var e,r,o,i=0,u=t.length;i<u;i++){if(r=Lt(t[i],n),r===0||i>0&&(o=Lt(t[i],t[i-1]),o>0&&e<=o&&r<=o&&(e+r-o)*(1-Math.pow((e-r)/o,2))<yt*o))return!0;e=r}return!1}function ne(t,n){return!!gn(t.map(io),re(n))}function io(t){return t=t.map(re),t.pop(),t}function re(t){return[t[0]*y,t[1]*y]}function ee(t,n){return(t&&Qr.hasOwnProperty(t.type)?Qr[t.type]:Sn)(t,n)}function oe(t,n,e){var r=dt(t,n-P,e).concat(n);return function(o){return r.map(function(i){return[o,i]})}}function ie(t,n,e){var r=dt(t,n-P,e).concat(n);return function(o){return r.map(function(i){return[i,o]})}}function Jn(){var t,n,e,r,o,i,u,l,m=10,p=m,a=90,f=360,s,c,d,M,v=2.5;function E(){return{type:"MultiLineString",coordinates:R()}}function R(){return dt($t(r/a)*a,e,a).map(d).concat(dt($t(l/f)*f,u,f).map(M)).concat(dt($t(n/m)*m,t,m).filter(function(g){return q(g%a)>P}).map(s)).concat(dt($t(i/p)*p,o,p).filter(function(g){return q(g%f)>P}).map(c))}return E.lines=function(){return R().map(function(g){return{type:"LineString",coordinates:g}})},E.outline=function(){return{type:"Polygon",coordinates:[d(r).concat(M(u).slice(1),d(e).reverse().slice(1),M(l).reverse().slice(1))]}},E.extent=function(g){return arguments.length?E.extentMajor(g).extentMinor(g):E.extentMinor()},E.extentMajor=function(g){return arguments.length?(r=+g[0][0],e=+g[1][0],l=+g[0][1],u=+g[1][1],r>e&&(g=r,r=e,e=g),l>u&&(g=l,l=u,u=g),E.precision(v)):[[r,l],[e,u]]},E.extentMinor=function(g){return arguments.length?(n=+g[0][0],t=+g[1][0],i=+g[0][1],o=+g[1][1],n>t&&(g=n,n=t,t=g),i>o&&(g=i,i=o,o=g),E.precision(v)):[[n,i],[t,o]]},E.step=function(g){return arguments.length?E.stepMajor(g).stepMinor(g):E.stepMinor()},E.stepMajor=function(g){return arguments.length?(a=+g[0],f=+g[1],E):[a,f]},E.stepMinor=function(g){return arguments.length?(m=+g[0],p=+g[1],E):[m,p]},E.precision=function(g){return arguments.length?(v=+g,s=oe(i,o,90),c=ie(n,t,v),d=oe(l,u,90),M=ie(r,e,v),E):v},E.extentMajor([[-180,-90+P],[180,90-P]]).extentMinor([[-180,-80-P],[180,80+P]])}function ae(){return Jn()()}function fe(t,n){var e=t[0]*y,r=t[1]*y,o=n[0]*y,i=n[1]*y,u=S(r),l=x(r),m=S(i),p=x(i),a=u*S(e),f=u*x(e),s=m*S(o),c=m*x(o),d=2*j(X(Ln(i-r)+u*m*Ln(o-e))),M=x(d),v=d?function(E){var R=x(E*=d)/M,g=x(d-E)/M,w=g*a+R*s,A=g*f+R*c,N=g*l+R*p;return[Z(A,w)*F,Z(N,X(w*w+A*A))*F]}:function(){return[e*F,r*F]};return v.distance=d,v}var Ht=t=>t;var Kn=new D,Qn=new D,ue,le,Vn,bn,xt={point:z,lineStart:z,lineEnd:z,polygonStart:function(){xt.lineStart=ao,xt.lineEnd=uo},polygonEnd:function(){xt.lineStart=xt.lineEnd=xt.point=z,Kn.add(q(Qn)),Qn=new D},result:function(){var t=Kn/2;return Kn=new D,t}};function ao(){xt.point=fo}function fo(t,n){xt.point=se,ue=Vn=t,le=bn=n}function se(t,n){Qn.add(bn*t-Vn*n),Vn=t,bn=n}function uo(){se(ue,le)}var tr=xt;var zt=1/0,wn=zt,jt=-zt,Pn=jt,lo={point:so,lineStart:z,lineEnd:z,polygonStart:z,polygonEnd:z,result:function(){var t=[[zt,wn],[jt,Pn]];return jt=Pn=-(wn=zt=1/0),t}};function so(t,n){t<zt&&(zt=t),t>jt&&(jt=t),n<wn&&(wn=n),n>Pn&&(Pn=n)}var _t=lo;var nr=0,rr=0,Ut=0,Mn=0,Rn=0,Gt=0,er=0,or=0,Jt=0,de,me,lt,st,ut={point:Mt,lineStart:ce,lineEnd:pe,polygonStart:function(){ut.lineStart=mo,ut.lineEnd=ho},polygonEnd:function(){ut.point=Mt,ut.lineStart=ce,ut.lineEnd=pe},result:function(){var t=Jt?[er/Jt,or/Jt]:Gt?[Mn/Gt,Rn/Gt]:Ut?[nr/Ut,rr/Ut]:[NaN,NaN];return nr=rr=Ut=Mn=Rn=Gt=er=or=Jt=0,t}};function Mt(t,n){nr+=t,rr+=n,++Ut}function ce(){ut.point=co}function co(t,n){ut.point=po,Mt(lt=t,st=n)}function po(t,n){var e=t-lt,r=n-st,o=X(e*e+r*r);Mn+=o*(lt+t)/2,Rn+=o*(st+n)/2,Gt+=o,Mt(lt=t,st=n)}function pe(){ut.point=Mt}function mo(){ut.point=go}function ho(){he(de,me)}function go(t,n){ut.point=he,Mt(de=lt=t,me=st=n)}function he(t,n){var e=t-lt,r=n-st,o=X(e*e+r*r);Mn+=o*(lt+t)/2,Rn+=o*(st+n)/2,Gt+=o,o=st*t-lt*n,er+=o*(lt+t),or+=o*(st+n),Jt+=o*3,Mt(lt=t,st=n)}var ir=ut;function An(t){this._context=t}An.prototype={_radius:4.5,pointRadius:function(t){return this._radius=t,this},polygonStart:function(){this._line=0},polygonEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){this._line===0&&this._context.closePath(),this._point=NaN},point:function(t,n){switch(this._point){case 0:{this._context.moveTo(t,n),this._point=1;break}case 1:{this._context.lineTo(t,n);break}default:{this._context.moveTo(t+this._radius,n),this._context.arc(t,n,this._radius,0,W);break}}},result:z};var fr=new D,ar,ge,ve,Kt,Qt,Cn={point:z,lineStart:function(){Cn.point=vo},lineEnd:function(){ar&&xe(ge,ve),Cn.point=z},polygonStart:function(){ar=!0},polygonEnd:function(){ar=null},result:function(){var t=+fr;return fr=new D,t}};function vo(t,n){Cn.point=xe,ge=Kt=t,ve=Qt=n}function xe(t,n){Kt-=t,Qt-=n,fr.add(X(Kt*Kt+Qt*Qt)),Kt=t,Qt=n}var ur=Cn;var Ee,qn,ye,Se,Ft=class{constructor(n){this._append=n==null?we:xo(n),this._radius=4.5,this._=""}pointRadius(n){return this._radius=+n,this}polygonStart(){this._line=0}polygonEnd(){this._line=NaN}lineStart(){this._point=0}lineEnd(){this._line===0&&(this._+="Z"),this._point=NaN}point(n,e){switch(this._point){case 0:{this._append`M${n},${e}`,this._point=1;break}case 1:{this._append`L${n},${e}`;break}default:{if(this._append`M${n},${e}`,this._radius!==ye||this._append!==qn){let r=this._radius,o=this._;this._="",this._append`m0,${r}a${r},${r} 0 1,1 0,${-2*r}a${r},${r} 0 1,1 0,${2*r}z`,ye=r,qn=this._append,Se=this._,this._=o}this._+=Se;break}}}result(){let n=this._;return this._="",n.length?n:null}};function we(t){let n=1;this._+=t[0];for(let e=t.length;n<e;++n)this._+=arguments[n]+t[n]}function xo(t){let n=Math.floor(t);if(!(n>=0))throw new RangeError(`invalid digits: ${t}`);if(n>15)return we;if(n!==Ee){let e=10**n;Ee=n,qn=function(o){let i=1;this._+=o[0];for(let u=o.length;i<u;++i)this._+=Math.round(arguments[i]*e)/e+o[i]}}return qn}function Pe(t,n){let e=3,r=4.5,o,i;function u(l){return l&&(typeof r=="function"&&i.pointRadius(+r.apply(this,arguments)),U(l,o(i))),i.result()}return u.area=function(l){return U(l,o(tr)),tr.result()},u.measure=function(l){return U(l,o(ur)),ur.result()},u.bounds=function(l){return U(l,o(_t)),_t.result()},u.centroid=function(l){return U(l,o(ir)),ir.result()},u.projection=function(l){return arguments.length?(o=l==null?(t=null,Ht):(t=l).stream,u):t},u.context=function(l){return arguments.length?(i=l==null?(n=null,new Ft(e)):new An(n=l),typeof r!="function"&&i.pointRadius(r),u):n},u.pointRadius=function(l){return arguments.length?(r=typeof l=="function"?l:(i.pointRadius(+l),+l),u):r},u.digits=function(l){if(!arguments.length)return e;if(l==null)e=null;else{let m=Math.floor(l);if(!(m>=0))throw new RangeError(`invalid digits: ${l}`);e=m}return n===null&&(i=new Ft(e)),u},u.projection(t).digits(e).context(n)}function Vt(t){return function(n){var e=new lr;for(var r in t)e[r]=t[r];return e.stream=n,e}}function lr(){}lr.prototype={constructor:lr,point:function(t,n){this.stream.point(t,n)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}};function sr(t,n,e){var r=t.clipExtent&&t.clipExtent();return t.scale(150).translate([0,0]),r!=null&&t.clipExtent(null),U(e,t.stream(_t)),n(_t.result()),r!=null&&t.clipExtent(r),t}function cr(t,n,e){return sr(t,function(r){var o=n[1][0]-n[0][0],i=n[1][1]-n[0][1],u=Math.min(o/(r[1][0]-r[0][0]),i/(r[1][1]-r[0][1])),l=+n[0][0]+(o-u*(r[1][0]+r[0][0]))/2,m=+n[0][1]+(i-u*(r[1][1]+r[0][1]))/2;t.scale(150*u).translate([l,m])},e)}function Me(t,n,e){return cr(t,[[0,0],n],e)}function Re(t,n,e){return sr(t,function(r){var o=+n,i=o/(r[1][0]-r[0][0]),u=(o-i*(r[1][0]+r[0][0]))/2,l=-i*r[0][1];t.scale(150*i).translate([u,l])},e)}function Ae(t,n,e){return sr(t,function(r){var o=+n,i=o/(r[1][1]-r[0][1]),u=-i*r[0][0],l=(o-i*(r[1][1]+r[0][1]))/2;t.scale(150*i).translate([u,l])},e)}var Ce=16,Eo=S(30*y);function pr(t,n){return+n?So(t,n):yo(t)}function yo(t){return Vt({point:function(n,e){n=t(n,e),this.stream.point(n[0],n[1])}})}function So(t,n){function e(r,o,i,u,l,m,p,a,f,s,c,d,M,v){var E=p-r,R=a-o,g=E*E+R*R;if(g>4*n&&M--){var w=u+s,A=l+c,N=m+d,T=X(w*w+A*A+N*N),_=j(N/=T),G=q(q(N)-1)<P||q(i-f)<P?(i+f)/2:Z(A,w),k=t(G,_),C=k[0],b=k[1],O=C-r,$=b-o,h=R*O-E*$;(h*h/g>n||q((E*O+R*$)/g-.5)>.3||u*s+l*c+m*d<Eo)&&(e(r,o,i,u,l,m,C,b,G,w/=T,A/=T,N,M,v),v.point(C,b),e(C,b,G,w,A,N,p,a,f,s,c,d,M,v))}}return function(r){var o,i,u,l,m,p,a,f,s,c,d,M,v={point:E,lineStart:R,lineEnd:w,polygonStart:function(){r.polygonStart(),v.lineStart=A},polygonEnd:function(){r.polygonEnd(),v.lineStart=R}};function E(_,G){_=t(_,G),r.point(_[0],_[1])}function R(){f=NaN,v.point=g,r.lineStart()}function g(_,G){var k=it([_,G]),C=t(_,G);e(f,s,a,c,d,M,f=C[0],s=C[1],a=_,c=k[0],d=k[1],M=k[2],Ce,r),r.point(f,s)}function w(){v.point=E,r.lineEnd()}function A(){R(),v.point=N,v.lineEnd=T}function N(_,G){g(o=_,G),i=f,u=s,l=c,m=d,p=M,v.point=g}function T(){e(f,s,a,c,d,M,i,u,o,l,m,p,Ce,r),v.lineEnd=w,w()}return v}}var wo=Vt({point:function(t,n){this.stream.point(t*y,n*y)}});function Po(t){return Vt({point:function(n,e){var r=t(n,e);return this.stream.point(r[0],r[1])}})}function Mo(t,n,e,r,o){function i(u,l){return u*=r,l*=o,[n+t*u,e-t*l]}return i.invert=function(u,l){return[(u-n)/t*r,(e-l)/t*o]},i}function qe(t,n,e,r,o,i){if(!i)return Mo(t,n,e,r,o);var u=S(i),l=x(i),m=u*t,p=l*t,a=u/t,f=l/t,s=(l*e-u*n)/t,c=(l*n+u*e)/t;function d(M,v){return M*=r,v*=o,[m*M-p*v+n,e-p*M-m*v]}return d.invert=function(M,v){return[r*(a*M-f*v+s),o*(c-f*M-a*v)]},d}function bt(t){return Ro(function(){return t})()}function Ro(t){var n,e=150,r=480,o=250,i=0,u=0,l=0,m=0,p=0,a,f=0,s=1,c=1,d=null,M=Zn,v=null,E,R,g,w=Ht,A=.5,N,T,_,G,k;function C(h){return _(h[0]*y,h[1]*y)}function b(h){return h=_.invert(h[0],h[1]),h&&[h[0]*F,h[1]*F]}C.stream=function(h){return G&&k===h?G:G=wo(Po(a)(M(N(w(k=h)))))},C.preclip=function(h){return arguments.length?(M=h,d=void 0,$()):M},C.postclip=function(h){return arguments.length?(w=h,v=E=R=g=null,$()):w},C.clipAngle=function(h){return arguments.length?(M=+h?Ur(d=h*y):(d=null,Zn),$()):d*F},C.clipExtent=function(h){return arguments.length?(w=h==null?(v=E=R=g=null,Ht):Wn(v=+h[0][0],E=+h[0][1],R=+h[1][0],g=+h[1][1]),$()):v==null?null:[[v,E],[R,g]]},C.scale=function(h){return arguments.length?(e=+h,O()):e},C.translate=function(h){return arguments.length?(r=+h[0],o=+h[1],O()):[r,o]},C.center=function(h){return arguments.length?(i=h[0]%360*y,u=h[1]%360*y,O()):[i*F,u*F]},C.rotate=function(h){return arguments.length?(l=h[0]%360*y,m=h[1]%360*y,p=h.length>2?h[2]%360*y:0,O()):[l*F,m*F,p*F]},C.angle=function(h){return arguments.length?(f=h%360*y,O()):f*F},C.reflectX=function(h){return arguments.length?(s=h?-1:1,O()):s<0},C.reflectY=function(h){return arguments.length?(c=h?-1:1,O()):c<0},C.precision=function(h){return arguments.length?(N=pr(T,A=h*h),$()):X(A)},C.fitExtent=function(h,L){return cr(C,h,L)},C.fitSize=function(h,L){return Me(C,h,L)},C.fitWidth=function(h,L){return Re(C,h,L)},C.fitHeight=function(h,L){return Ae(C,h,L)};function O(){var h=qe(e,0,0,s,c,f).apply(null,n(i,u)),L=qe(e,r-h[0],o-h[1],s,c,f);return a=Yn(l,m,p),T=Zt(n,L),_=Zt(a,T),N=pr(T,A),$()}function $(){return G=k=null,C}return function(){return n=t.apply(this,arguments),C.invert=n.invert&&b,O()}}function Ne(t){return function(n,e){var r=X(n*n+e*e),o=t(r),i=x(o),u=S(o);return[Z(n*i,r*u),j(r&&e*i/r)]}}function dr(t,n){var e=n*n,r=e*e;return[t*(.8707-.131979*e+r*(-.013791+r*(.003971*e-.001529*r))),n*(1.007226+e*(.015085+r*(-.044475+.028874*e-.005916*r)))]}dr.invert=function(t,n){var e=n,r=25,o;do{var i=e*e,u=i*i;e-=o=(e*(1.007226+i*(.015085+u*(-.044475+.028874*i-.005916*u)))-n)/(1.007226+i*(.015085*3+u*(-.044475*7+.028874*9*i-.005916*11*u)))}while(q(o)>P&&--r>0);return[t/(.8707+(i=e*e)*(-.131979+i*(-.013791+i*i*i*(.003971-.001529*i)))),e]};function Ie(){return bt(dr).scale(175.295)}function mr(t,n){return[S(n)*x(t),x(n)]}mr.invert=Ne(j);function Le(){return bt(mr).scale(249.5).clipAngle(90+P)}function hr(t){return t}function Nn(t){if(t==null)return hr;var n,e,r=t.scale[0],o=t.scale[1],i=t.translate[0],u=t.translate[1];return function(l,m){m||(n=e=0);var p=2,a=l.length,f=new Array(a);for(f[0]=(n+=l[0])*r+i,f[1]=(e+=l[1])*o+u;p<a;)f[p]=l[p],++p;return f}}function ze(t,n){for(var e,r=t.length,o=r-n;o<--r;)e=t[o],t[o++]=t[r],t[r]=e}function Ge(t,n){return typeof n=="string"&&(n=t.objects[n]),n.type==="GeometryCollection"?{type:"FeatureCollection",features:n.geometries.map(function(e){return _e(t,e)})}:_e(t,n)}function _e(t,n){var e=n.id,r=n.bbox,o=n.properties==null?{}:n.properties,i=In(t,n);return e==null&&r==null?{type:"Feature",properties:o,geometry:i}:r==null?{type:"Feature",id:e,properties:o,geometry:i}:{type:"Feature",id:e,bbox:r,properties:o,geometry:i}}function In(t,n){var e=Nn(t.transform),r=t.arcs;function o(a,f){f.length&&f.pop();for(var s=r[a<0?~a:a],c=0,d=s.length;c<d;++c)f.push(e(s[c],c));a<0&&ze(f,d)}function i(a){return e(a)}function u(a){for(var f=[],s=0,c=a.length;s<c;++s)o(a[s],f);return f.length<2&&f.push(f[0]),f}function l(a){for(var f=u(a);f.length<4;)f.push(f[0]);return f}function m(a){return a.map(l)}function p(a){var f=a.type,s;switch(f){case"GeometryCollection":return{type:f,geometries:a.geometries.map(p)};case"Point":s=i(a.coordinates);break;case"MultiPoint":s=a.coordinates.map(i);break;case"LineString":s=u(a.arcs);break;case"MultiLineString":s=a.arcs.map(u);break;case"Polygon":s=m(a.arcs);break;case"MultiPolygon":s=a.arcs.map(m);break;default:return null}return{type:f,coordinates:s}}return p(n)}function gr(t,n){var e={},r={},o={},i=[],u=-1;n.forEach(function(p,a){var f=t.arcs[p<0?~p:p],s;f.length<3&&!f[1][0]&&!f[1][1]&&(s=n[++u],n[u]=p,n[a]=s)}),n.forEach(function(p){var a=l(p),f=a[0],s=a[1],c,d;if(c=o[f])if(delete o[c.end],c.push(p),c.end=s,d=r[s]){delete r[d.start];var M=d===c?c:c.concat(d);r[M.start=c.start]=o[M.end=d.end]=M}else r[c.start]=o[c.end]=c;else if(c=r[s])if(delete r[c.start],c.unshift(p),c.start=f,d=o[f]){delete o[d.end];var v=d===c?c:d.concat(c);r[v.start=d.start]=o[v.end=c.end]=v}else r[c.start]=o[c.end]=c;else c=[p],r[c.start=f]=o[c.end=s]=c});function l(p){var a=t.arcs[p<0?~p:p],f=a[0],s;return t.transform?(s=[0,0],a.forEach(function(c){s[0]+=c[0],s[1]+=c[1]})):s=a[a.length-1],p<0?[s,f]:[f,s]}function m(p,a){for(var f in p){var s=p[f];delete a[s.start],delete s.start,delete s.end,s.forEach(function(c){e[c<0?~c:c]=1}),i.push(s)}}return m(o,r),m(r,o),n.forEach(function(p){e[p<0?~p:p]||i.push([p])}),i}function Fe(t){return In(t,Te.apply(this,arguments))}function Te(t,n,e){var r,o,i;if(arguments.length>1)r=Ao(t,n,e);else for(o=0,r=new Array(i=t.arcs.length);o<i;++o)r[o]=o;return{type:"MultiLineString",arcs:gr(t,r)}}function Ao(t,n,e){var r=[],o=[],i;function u(f){var s=f<0?~f:f;(o[s]||(o[s]=[])).push({i:f,g:i})}function l(f){f.forEach(u)}function m(f){f.forEach(l)}function p(f){f.forEach(m)}function a(f){switch(i=f,f.type){case"GeometryCollection":f.geometries.forEach(a);break;case"LineString":l(f.arcs);break;case"MultiLineString":case"Polygon":m(f.arcs);break;case"MultiPolygon":p(f.arcs);break}}return a(n),o.forEach(e==null?function(f){r.push(f[0].i)}:function(f){e(f[0].g,f[f.length-1].g)&&r.push(f[0].i)}),r}
return { feature: Ge, geoArea: Ar, geoBounds: Gr, geoCentroid: Br, geoContains: ee, geoDistance: Lt, geoGraticule10: ae, geoInterpolate: fe, geoNaturalEarth1: Ie, geoOrthographic: Le, geoPath: Pe, geoRotation: Zr, mesh: Fe };
})();
const { feature, geoArea, geoBounds, geoCentroid, geoContains, geoDistance, geoGraticule10, geoInterpolate, geoNaturalEarth1, geoOrthographic, geoPath, geoRotation, mesh } = __GEO;

const __ANSWER = (function(){
// Checking a typed name against a subdivision. No page code here.

// Words that say what kind of place it is, not which one: "Kyiv Oblast" and "Kyiv" are the same answer
const KIND_WORDS = /\b(province|provincia|state|region|oblast|krai|okrug|county|district|department|departamento|prefecture|governorate|municipality|city|canton|parish|territory|emirate|division|voivodeship|republic|autonomous|federal|capital|special|administrative|metropolitan|of|the|de|del|do|da)\b/g;

// Letters that are not a plain letter with an accent on it, so taking accents off leaves them as they are
const PLAIN = { đ: 'd', ð: 'd', ø: 'o', ł: 'l', ı: 'i', ß: 'ss', æ: 'ae', œ: 'oe', þ: 'th' };

// Letters and digits only, accents off: "Côte-d'Or" -> "cotedor", "Đà Nẵng" -> "da nang"
function norm(s) {
	return String(s ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[đðøłıßæœþ]/g, (c) => PLAIN[c])
		.replace(/&/g, ' and ')
		.replace(/\bst\b\.?/g, 'saint')
		.replace(/[^a-z0-9 ]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}
const squash = (s) => s.replace(/ /g, '');

function editDistance(a, b) {
	const m = a.length, n = b.length;
	if (!m) return n;
	if (!n) return m;
	let prev = Array.from({ length: n + 1 }, (_, j) => j);
	for (let i = 1; i <= m; i++) {
		const cur = [i];
		for (let j = 1; j <= n; j++) {
			cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
		}
		prev = cur;
	}
	return prev[n];
}

// Every spelling that counts as right for a unit: its name, its other names, each with and without
// a "(city)" tag and the kind words
function answerForms(unit) {
	const forms = new Set();
	for (const raw of [unit.name, ...(unit.alts || [])]) {
		const bare = String(raw).replace(/\s*\([^)]*\)\s*/g, ' ');
		for (const s of [raw, bare]) {
			const n = norm(s);
			if (n) forms.add(squash(n));
			const short = squash(n.replace(KIND_WORDS, ' ').replace(/\s+/g, ' ').trim());
			if (short.length >= 3) forms.add(short);
		}
	}
	return [...forms];
}

// A unit's names exactly as written (accents and spacing aside), with and without a "(city)" tag:
// kind words stay, so "Kyiv" and "Kyiv Oblast" are different names here
function fullForms(unit) {
	const forms = new Set();
	for (const raw of [unit.name, ...(unit.alts || [])]) {
		for (const s of [raw, String(raw).replace(/\s*\([^)]*\)\s*/g, ' ')]) {
			const n = squash(norm(s));
			if (n) forms.add(n);
		}
	}
	return forms;
}

// checkAnswer, knowing the other units of the country: typing another unit's own name is wrong, not a
// near miss ("Kabul" for Zabul) nor right through a shared kind word ("Kyiv" for Kyiv Oblast, when the
// city of Kyiv is a unit too)
function judgeAnswer(typed, unit, others = []) {
	const verdict = checkAnswer(typed, unit);
	if (verdict === 'empty' || verdict === 'wrong') return verdict;
	const t = squash(norm(typed));
	if (fullForms(unit).has(t)) return verdict;
	for (const other of others) if (other !== unit && fullForms(other).has(t)) return 'wrong';
	return verdict;
}

// -> 'exact', 'close' (a small spelling slip: half a point), 'wrong' or 'empty'
function checkAnswer(typed, unit) {
	const n = norm(typed);
	if (!n) return 'empty';
	const t = squash(n);
	const tShort = squash(n.replace(KIND_WORDS, ' ').replace(/\s+/g, ' ').trim());
	const forms = answerForms(unit);
	if (forms.includes(t) || (tShort.length >= 3 && forms.includes(tShort))) return 'exact';
	for (const f of forms) {
		const slack = f.length >= 8 ? 2 : f.length >= 5 ? 1 : 0;
		if (slack && (editDistance(t, f) <= slack || editDistance(tShort, f) <= slack)) return 'close';
	}
	return 'wrong';
}

return { norm, editDistance, answerForms, fullForms, judgeAnswer, checkAnswer };
})();
const { norm, editDistance, answerForms, fullForms, judgeAnswer, checkAnswer } = __ANSWER;

const __SESSION = (function(){
// A practice round or a test over one country's subdivisions. No page code here.
//
// Practice: every unit is asked; a wrong click or a give-up marks it missed, and missed units come
//   back at the end of the round (up to twice) so you get another go. The score is first-try answers.
// Test: one go at each unit; a wrong answer shows the right one and moves on.
// A misspelled typed answer ("close") counts as half a point in both.
function shuffled(n, random = Math.random) {
	const a = Array.from({ length: n }, (_, i) => i);
	for (let i = n - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

// units: [{ name, alts? }]; only: unit indexes to ask (default all)
function newSession(units, { mode, format, random = Math.random, only = null }) {
	const pool = only ?? units.map((_, i) => i);
	const order = shuffled(pool.length, random).map((k) => pool[k]);
	return {
		units, mode, format,
		total: order.length,
		queue: order, // what's still to ask; queue[0] is the current one
		result: new Map(), // unit index -> 'ok' | 'close' | 'bad' (its first answer)
		repeats: new Map(), // practice: how often a unit has come back
		wrongNow: false, // practice: the current unit has had a wrong answer this time round
		attempts: 0,
		streak: 0,
		answered: 0,
	};
}

const current = (s) => (s.queue.length ? s.queue[0] : null);
const finished = (s) => s.queue.length === 0;

function settle(s, outcome) {
	const i = s.queue.shift();
	if (!s.result.has(i)) s.result.set(i, s.wrongNow && outcome !== 'bad' ? 'bad' : outcome);
	const missed = outcome === 'bad' || s.wrongNow;
	s.streak = missed ? 0 : s.streak + 1;
	if (missed && s.mode === 'practice' && (s.repeats.get(i) || 0) < 2) {
		s.repeats.set(i, (s.repeats.get(i) || 0) + 1);
		s.queue.push(i); // comes back at the end
	}
	s.wrongNow = false;
	s.answered++;
	return i;
}

// A click on unit `picked` when the current one was asked for.
// -> { outcome: 'ok' | 'wrong', target, moved } (moved: the round went on to the next unit)
function answerClick(s, picked) {
	const target = current(s);
	if (target == null) return null;
	s.attempts++;
	if (picked === target) {
		settle(s, 'ok');
		return { outcome: 'ok', target, moved: true };
	}
	if (s.mode === 'test') {
		settle(s, 'bad');
		return { outcome: 'wrong', target, moved: true };
	}
	s.wrongNow = true;
	s.streak = 0;
	return { outcome: 'wrong', target, moved: false };
}

// A typed name for the current (highlighted) unit.
// -> { outcome: 'ok' | 'close' | 'wrong' | 'empty', target, moved }
function answerType(s, text) {
	const target = current(s);
	if (target == null) return null;
	const verdict = judgeAnswer(text, s.units[target], s.units);
	if (verdict === 'empty') return { outcome: 'empty', target, moved: false };
	s.attempts++;
	if (verdict === 'exact' || verdict === 'close') {
		const outcome = verdict === 'exact' ? 'ok' : 'close';
		settle(s, outcome);
		return { outcome, target, moved: true };
	}
	if (s.mode === 'test') {
		settle(s, 'bad');
		return { outcome: 'wrong', target, moved: true };
	}
	s.wrongNow = true;
	s.streak = 0;
	return { outcome: 'wrong', target, moved: false };
}

// See the answer: counts as missed
function giveUp(s) {
	const target = current(s);
	if (target == null) return null;
	settle(s, 'bad');
	return { outcome: 'gaveup', target, moved: true };
}

// Leave the current one for later (no penalty); nothing happens if it's the last one left
function skip(s) {
	if (s.queue.length < 2) return false;
	s.queue.push(s.queue.shift());
	s.wrongNow = false;
	return true;
}

function summary(s) {
	let ok = 0, close = 0, bad = 0;
	for (const r of s.result.values()) {
		if (r === 'ok') ok++;
		else if (r === 'close') close++;
		else bad++;
	}
	return { total: s.total, ok, close, bad, score: ok + close / 2, missed: [...s.result].filter(([, r]) => r === 'bad').map(([i]) => i) };
}

// Is `a` a better result than the saved best `b`? More points first, then less time.
function better(a, b) {
	if (!b) return true;
	const pa = a.score / a.total, pb = b.score / b.total;
	return pa > pb || (pa === pb && a.ms < b.ms);
}

return { newSession, current, finished, answerClick, answerType, giveUp, skip, summary, better };
})();
const { newSession, current, finished, answerClick, answerType, giveUp, skip, summary, better } = __SESSION;

const __MAP = (function(){
// The map: a globe you can drag and zoom, drawn on one canvas. It shows the world's countries
// (the World Capitals map's own shapes, so the borders are the same) and, on top, the subdivisions
// of the country being studied. The page decides the colours and labels through `view`.
//
// It is drawn to look like the World Capitals globe: the same sea, glow, grid, shading, colours,
// border widths, lakes and rivers, from the same files, with the same numbers. Change one, change
// the other (capital-atlas/app.js: COL, drawBase, drawWater, lodName). What it leaves out on
// purpose: the names of seas, lakes and rivers, and naming a lake when it is clicked.
const COL = {
	seaLit: '#1a3142', // the sea where the light falls, top left
	seaDark: '#0b1820',
	glow: '111, 208, 232', // the thin atmosphere round the globe
	grat: 'rgba(111, 208, 232, 0.08)',
	shade: '4, 8, 12', // darkening toward the rim, so it reads as a ball
	lake: '#1d4560',
	lakeEdge: 'rgba(9, 14, 19, 0.55)',
	river: 'rgba(74, 146, 190, 0.8)',
	land: '#c6bba2', // a country you can study, or a subdivision not yet answered
	landOff: '#857f6f', // a country with no subdivisions to learn
	other: '#4b585f', // the rest of the world while one country is open
	territory: '#384449',
	border: 'rgba(9, 14, 19, 0.9)',
	hover: 'rgba(255, 250, 238, 0.32)',
	target: '#6fd0e8',
	targetEdge: '#bff0fb', // the thin light line round the province being looked at or asked about
	ok: '#86c39a',
	close: '#e2c35c',
	bad: '#d08a7c',
	ring: '#ecdec2',
	label: '#ecdec2',
	labelHalo: 'rgba(8, 15, 21, 0.85)',
};
const DEG = Math.PI / 180, TAU = Math.PI * 2;
const TINY = 12; // a unit smaller than this on screen gets a ring you can click
const RING = 9;
const GRAT = geoGraticule10();
const LEVELS = ['low', 'mid', 'high']; // the world's shapes, coarse to fine
const LAKE_LEAD = 0.5, RIVER_LEAD = 0.3; // lakes show from half a zoom level early, rivers a little less
const RIVER_CLASSES = [[0, 2], [3, 4], [5, 99]];

const biggestPiece = (g) => {
	if (g.type !== 'MultiPolygon') return g;
	let best = null, area = -1;
	for (const coords of g.coordinates) {
		const a = geoArea({ type: 'Polygon', coordinates: coords });
		if (a > area) [best, area] = [coords, a];
	}
	return { type: 'Polygon', coordinates: best };
};
// A point inside a polygon whose centroid isn't: the middle of the widest stretch of the shape along
// the centroid's latitude (holes cut the stretches)
function insidePoint(poly) {
	const lat = geoCentroid(poly)[1], xs = [];
	for (const ring of poly.coordinates) {
		for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
			const [x1, y1] = ring[i], [x2, y2] = ring[j];
			if (y1 > lat !== y2 > lat) xs.push(x1 + ((lat - y1) / (y2 - y1)) * (x2 - x1));
		}
	}
	xs.sort((a, b) => a - b);
	let best = null, width = 0;
	for (let k = 0; k + 1 < xs.length; k += 2) if (xs[k + 1] - xs[k] > width) [best, width] = [(xs[k] + xs[k + 1]) / 2, xs[k + 1] - xs[k]];
	return best == null ? null : [best, lat];
}
// The part of a country worth framing: its units' main pieces, without one or two far-off ones
// (Alaska and Hawaii, the Canaries, Svalbard), which would shrink everything else.
// -> { shape, far: [unit indexes left out] }
function mainCluster(features) {
	const pieces = features.map((f) => ({ type: 'Feature', properties: {}, geometry: biggestPiece(f.geometry) }));
	const centres = pieces.map((p) => geoCentroid(p));
	const reachOf = (keep) => {
		let x = 0, y = 0, z = 0;
		for (const i of keep) {
			const [lon, lat] = centres[i];
			x += Math.cos(lat * DEG) * Math.cos(lon * DEG);
			y += Math.cos(lat * DEG) * Math.sin(lon * DEG);
			z += Math.sin(lat * DEG);
		}
		const mid = [Math.atan2(y, x) / DEG, Math.atan2(z, Math.hypot(x, y)) / DEG];
		let far = -1, reach = 0;
		const ds = [];
		for (const i of keep) {
			const d = geoDistance(mid, centres[i]);
			ds.push(d);
			if (d > reach) [far, reach] = [i, d];
		}
		ds.sort((a, b) => a - b);
		return { far, reach, typical: ds[ds.length >> 1] };
	};
	// boxes that touch: the unit is joined to (or right beside) another one, not off on its own
	const boxes = features.map((f) => geoBounds(f));
	const spans = ([[w], [e]]) => (w <= e ? [[w, e]] : [[w, 180], [-180, e]]);
	const touching = (a, b) => a[0][1] <= b[1][1] + 0.05 && b[0][1] <= a[1][1] + 0.05 && spans(a).some(([w1, e1]) => spans(b).some(([w2, e2]) => w1 <= e2 + 0.05 && w2 <= e1 + 0.05));
	const alone = (i, keep) => !keep.some((j) => j !== i && touching(boxes[i], boxes[j]));
	let keep = features.map((_, i) => i);
	const out = [];
	for (let n = Math.min(2, Math.floor((features.length - 1) / 4)); n > 0; n--) {
		const all = reachOf(keep), rest = keep.filter((i) => i !== all.far);
		// far-off means: on its own, three times as far out as a typical unit, and the view gets a fifth tighter without it
		if (!alone(all.far, keep) || all.reach < 3 * all.typical || reachOf(rest).reach > 0.8 * all.reach) break;
		out.push(all.far);
		keep = rest;
	}
	return { shape: { type: 'FeatureCollection', features: keep.map((i) => pieces[i]) }, far: out };
}
// What a shape needs for drawing, picking and labels
function measure(f) {
	const main = biggestPiece(f.geometry);
	const b = geoBounds(f);
	let c = geoCentroid(main);
	if (!geoContains(main, c)) c = insidePoint(main) || c; // a hollow or bent shape (Brandenburg round Berlin)
	const far = Math.max(...[[b[0][0], b[0][1]], [b[1][0], b[1][1]], [b[0][0], b[1][1]], [b[1][0], b[0][1]]].map((p) => geoDistance(c, p)));
	return { bounds: b, centre: c, reach: Math.min(Math.PI, far), area: geoArea(f) };
}
// d3 reads a ring's direction to tell a shape from everything-but-that-shape. Make every ring of a
// feature run the way d3 expects (an outer ring encloses less than half the globe; a hole, as d3 sees
// it, more), whatever the map files' builder did.
function rewind(f) {
	const fix = (poly) => poly.forEach((ring, k) => {
		const big = geoArea({ type: 'Polygon', coordinates: [ring] }) > 2 * Math.PI;
		if (big !== k > 0) ring.reverse();
	});
	if (f.geometry.type === 'Polygon') fix(f.geometry.coordinates);
	else if (f.geometry.type === 'MultiPolygon') f.geometry.coordinates.forEach(fix);
	return f;
}
const inBounds = ([[w, s], [e, n]], [lon, lat]) => lat >= s && lat <= n && (w <= e ? lon >= w && lon <= e : lon >= w || lon <= e);
// A lake or river: where it is and how far it reaches, for leaving out what's off screen
function measureWater(f) {
	const c = geoCentroid(f);
	let r = 0;
	const walk = (a) => (typeof a[0] === 'number' ? (r = Math.max(r, geoDistance(c, a))) : a.forEach(walk));
	walk(f.geometry.coordinates);
	return { f, m: { centre: c, reach: r + 0.005, area: geoArea(f) } };
}

// need(file): the map would like 'map-mid', 'map-high' or 'water-high' (it asks once for each);
// the page fetches it and hands it over with setWorldDetail or setWater
function createMap({ canvas, insets, view, onClick, onHover, need = () => {} }) {
	// What only changes when the view does is kept as two pictures and pasted in on every other redraw
	// (a hover, an answer): `under` the provinces the sea and the world, `over` them the lakes, the
	// rivers and the shading. `ctx` is whichever of the three canvases is being drawn on.
	const screen = canvas.getContext('2d');
	const sheet = () => {
		const c = document.createElement('canvas');
		return { c, ctx: c.getContext('2d') };
	};
	const under = sheet(), over = sheet();
	const shore = sheet(), shoreLit = sheet(); // the lit province's lake shores (see drawShores)
	let shoreKept = '';
	let kept = ''; // the view the two pictures were drawn for
	let stamp = 0; // goes up when their contents change for another reason (new shapes arrived)
	let ctx = screen;
	let dpr = 1, W = 0, H = 0;
	let world = []; // [{ id, name, feature, m, detail: { mid, high } }]
	const water = { low: null, high: null }; // { lakes: [{ f, m }], rivers: [{ f, m }] }
	const asked = new Set();
	let moving = false, movingTimer = 0, slow = false; // slow: this device can't keep up while the map moves
	let rim = null; // for shapes at the globe's rim (see trace)
	let units = []; // [{ feature, m }]
	let openId = null; // the country whose units are showing (its world shape isn't drawn)
	const cam = { lon: 10, lat: 20, scale: 200 };
	let fitScale = 200;
	let proj = null, path = null;
	let fly = null, raf = 0;
	let tiny = { scale: 0, set: new Set(), full: false };
	let rings = []; // tiny units on screen: { i, x, y }

	function free() {
		const i = insets();
		return { x0: i.left, y0: i.top, x1: W - i.right, y1: H - i.bottom, w: Math.max(60, W - i.left - i.right), h: Math.max(60, H - i.top - i.bottom) };
	}
	function setProjection() {
		const f = free();
		proj = geoOrthographic().rotate([-cam.lon, -cam.lat]).scale(cam.scale).translate([f.x0 + f.w / 2, f.y0 + f.h / 2]).clipAngle(90).precision(0);
		path = geoPath(proj, ctx);
		rim = { area: geoPath(proj), alts: null };
	}
	// The map is moving (a drag, a pinch, the wheel, a flight): slow devices draw less until it stops
	function stir() {
		moving = true;
		clearTimeout(movingTimer);
		movingTimer = setTimeout(() => {
			moving = false;
			invalidate();
		}, 180);
	}
	function resize() {
		dpr = Math.min(2, window.devicePixelRatio || 1);
		W = window.innerWidth;
		H = window.innerHeight;
		for (const c of [canvas, under.c, over.c, shore.c, shoreLit.c]) {
			c.width = Math.round(W * dpr);
			c.height = Math.round(H * dpr);
		}
		kept = '';
		setProjection();
		invalidate();
	}

	// Where to look to see all of `shape` (a GeoJSON object), or the whole globe for null
	function cameraFor(shape) {
		const f = free();
		if (!shape) return { lon: cam.lon, lat: 15, scale: (Math.min(f.w, f.h) / 2) * 0.94 };
		const [lon, lat] = geoCentroid(shape);
		const p = geoOrthographic().rotate([-lon, -lat]).scale(1).translate([0, 0]).clipAngle(90);
		const [[x0, y0], [x1, y1]] = geoPath(p).bounds(shape);
		const scale = Math.min(f.w / Math.max(1e-6, x1 - x0), f.h / Math.max(1e-6, y1 - y0)) * 0.9;
		// the shape's box is rarely centred on its centroid: shift the view to the box's middle
		const mid = p.invert([(x0 + x1) / 2, (y0 + y1) / 2]) || [lon, lat];
		return { lon: mid[0], lat: Math.max(-85, Math.min(85, mid[1])), scale: Math.min(scale, 40000) };
	}
	function frame(shape, animate = true) {
		const to = cameraFor(shape);
		fitScale = to.scale;
		if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
			Object.assign(cam, to);
			fly = null;
			setProjection();
			invalidate();
			return;
		}
		let dl = to.lon - cam.lon;
		dl = ((dl + 540) % 360) - 180;
		fly = { from: { ...cam }, dl, to, t0: performance.now(), ms: 650 };
		invalidate();
	}
	function stepFly(now) {
		if (!fly) return;
		const t = Math.min(1, (now - fly.t0) / fly.ms), e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
		cam.lon = fly.from.lon + fly.dl * e;
		cam.lat = fly.from.lat + (fly.to.lat - fly.from.lat) * e;
		cam.scale = Math.exp(Math.log(fly.from.scale) + (Math.log(fly.to.scale) - Math.log(fly.from.scale)) * e);
		if (t >= 1) fly = null;
		setProjection();
	}
	function invalidate() {
		if (!raf) raf = requestAnimationFrame(draw);
	}

	// how far round the globe the screen can see: a quarter turn at most, less when zoomed in
	function viewCap() {
		const f = free(), cx = f.x0 + f.w / 2, cy = f.y0 + f.h / 2;
		const half = Math.max(...[[0, 0], [W, 0], [0, H], [W, H]].map(([x, y]) => Math.hypot(x - cx, y - cy)));
		return half >= cam.scale ? Math.PI / 2 : Math.asin(half / cam.scale);
	}
	let cap = Math.PI / 2; // viewCap() for the frame being drawn
	// some of the shape is on screen (so it is worth drawing)
	const facing = (m) => geoDistance(m.centre, [cam.lon, cam.lat]) - m.reach < cap;

	/* ---------- shapes at the globe's rim ---------- */
	// d3 trims each shape where the globe turns away, and now and then, at one angle, a shape near the
	// rim comes out inside out: it fills the whole globe instead of the sliver that shows. A drawn shape
	// can't be bigger than the place itself, so one near the rim that comes out more than twice its size
	// is drawn again trimmed a degree or two inside the rim, or left out of that frame.
	const nearRim = (m) => geoDistance(m.centre, [cam.lon, cam.lat]) + m.reach > Math.PI / 2 - 0.35;
	const tooBig = (areaPath, f, m) => areaPath.area(f) > m.area * cam.scale ** 2 * 2 + 50;
	const insideOut = (f, m) => nearRim(m) && tooBig(rim.area, f, m);
	// Add a shape's outline to the current path; false if it's left out of this frame
	function trace(f, m) {
		if (!insideOut(f, m)) {
			path(f);
			return true;
		}
		if (!rim.alts) {
			rim.alts = [89, 87.5].map((deg) => geoPath(geoOrthographic().rotate(proj.rotate()).translate(proj.translate()).scale(proj.scale()).clipAngle(deg).precision(0)));
		}
		for (const alt of rim.alts) {
			if (tooBig(alt, f, m)) continue;
			alt.context(ctx)(f);
			alt.context(null);
			return true;
		}
		return false;
	}

	/* ---------- detail, lakes and rivers ---------- */
	const ppd = () => cam.scale * DEG; // pixels per degree
	// Natural Earth gives each lake and river the web-map zoom it shows from (zoom 0 = the world in 256 px)
	const webZoom = () => Math.log2((ppd() * 360) / 256);
	// borders get thicker as you zoom in; rivers stay thinner than them so borders read first
	const borderWidth = () => Math.min(1.2, 0.45 + ppd() * 0.01);
	const riverWidth = (rank) => Math.max(0.45, borderWidth() * (rank <= 2 ? 0.75 : rank <= 4 ? 0.6 : 0.5));
	const ask = (file) => {
		if (asked.has(file)) return;
		asked.add(file);
		need(file);
	};
	// which of the world's shapes to draw at this zoom: finer ones are fetched the first time they'd show
	function level() {
		let want = ppd() < 14 ? 0 : ppd() < 70 ? 1 : 2;
		if (moving && slow && want > 0 && !(want === 2 && ppd() > 120)) want--;
		if (want > 0) ask('map-' + LEVELS[want]);
		return LEVELS[want];
	}
	const shapeOf = (c, lvl) => (lvl === 'high' && c.detail.high) || (lvl !== 'low' && c.detail.mid) || c.feature;
	function waterSet() {
		if (webZoom() >= 4.6) {
			ask('water-high');
			if (water.high && !(moving && slow)) return water.high;
		}
		return water.low;
	}
	function drawWater() {
		const w = waterSet();
		if (!w) return;
		const z = webZoom();
		const shown = (list, lead) => list.filter(({ f, m }) => f.properties.mz <= z + lead && facing(m));
		const lakes = shown(w.lakes, LAKE_LEAD);
		if (lakes.length) {
			ctx.beginPath();
			for (const { f, m } of lakes) if (!insideOut(f, m)) path(f);
			ctx.fillStyle = COL.lake;
			ctx.fill();
			ctx.lineWidth = 0.6;
			ctx.strokeStyle = COL.lakeEdge;
			ctx.stroke();
		}
		if (moving && slow) return; // rivers come back when the map stops
		const rivers = shown(w.rivers, RIVER_LEAD);
		ctx.lineCap = 'round';
		ctx.strokeStyle = COL.river;
		for (const [lo, hi] of RIVER_CLASSES) {
			ctx.beginPath();
			let any = false;
			for (const { f } of rivers) {
				if (f.properties.r < lo || f.properties.r > hi) continue;
				path(f);
				any = true;
			}
			if (!any) continue;
			ctx.lineWidth = riverWidth(lo);
			ctx.stroke();
		}
		ctx.lineCap = 'butt';
	}

	// the sea, the glow, the grid and the world's countries
	function drawUnder(lvl) {
		const [cx, cy] = proj.translate(), R = cam.scale;
		// The sea's edge and the grid are a few long curves (a meridian is only 3 points), so let d3
		// add points along them; the land is already dense and stays fast with that off.
		proj.precision(0.5);
		ctx.beginPath();
		path({ type: 'Sphere' });
		let g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.05, cx, cy, R);
		g.addColorStop(0, COL.seaLit);
		g.addColorStop(1, COL.seaDark);
		ctx.fillStyle = g;
		ctx.fill();
		g = ctx.createRadialGradient(cx, cy, R * 0.985, cx, cy, R * 1.07);
		g.addColorStop(0, `rgba(${COL.glow}, 0.28)`);
		g.addColorStop(1, `rgba(${COL.glow}, 0)`);
		ctx.beginPath();
		ctx.arc(cx, cy, R * 1.07, 0, TAU);
		ctx.arc(cx, cy, R * 0.985, 0, TAU, true);
		ctx.fillStyle = g;
		ctx.fill();
		ctx.beginPath();
		path(GRAT);
		ctx.strokeStyle = COL.grat;
		ctx.lineWidth = 0.6;
		ctx.stroke();
		proj.precision(0);
		// the world's countries, and the land that is no country's (Greenland, Western Sahara…)
		ctx.lineJoin = 'round';
		ctx.lineWidth = borderWidth();
		ctx.strokeStyle = COL.border;
		for (const c of world) {
			if ((openId && c.id === openId) || !facing(c.m)) continue;
			ctx.beginPath();
			if (!trace(shapeOf(c, lvl), c.m)) continue;
			ctx.fillStyle = view.country(c);
			ctx.fill();
			ctx.stroke();
		}
	}
	// lakes and rivers lie on top of the land (they are part of no country or province)
	function drawOver() {
		ctx.lineJoin = 'round';
		drawWater();
	}
	// darkening toward the rim, so it reads as a ball (last, over everything on the globe)
	function drawShade() {
		const [cx, cy] = proj.translate(), R = cam.scale;
		const g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.35, cx, cy, R);
		g.addColorStop(0, `rgba(${COL.shade}, 0)`);
		g.addColorStop(1, `rgba(${COL.shade}, 0.5)`);
		ctx.beginPath();
		ctx.arc(cx, cy, R, 0, TAU);
		ctx.fillStyle = g;
		ctx.fill();
	}
	// Where the lit province meets a lake, its shore gets the same light edge and glow as a coast or a land
	// border. The province's own outline runs through the lake (Michigan's legal border is out in the
	// water) and is covered by it, so the shore is drawn again, kept to the province's part of it. Only
	// the outer shore of all the lakes together: some lakes come in pieces (Saginaw Bay and Lake Huron),
	// and the line where two pieces meet is water, not shore. So the shore is drawn on its own sheet twice
	// as wide, the lakes are wiped out of it (leaving the land side), and the sheet is pasted in with the glow.
	function drawShores(lit) {
		const w = waterSet(), z = webZoom();
		if (!w) return;
		for (const { i } of lit) {
			const u = units[i];
			const lakes = w.lakes.filter(({ f, m }) => f.properties.mz <= z + LAKE_LEAD && facing(m) && !insideOut(f, m) && geoDistance(m.centre, u.m.centre) < m.reach + u.m.reach);
			if (!lakes.length) continue;
			const e = shore.ctx, to = ctx;
			e.setTransform(1, 0, 0, 1, 0, 0);
			e.clearRect(0, 0, shore.c.width, shore.c.height);
			e.setTransform(dpr, 0, 0, dpr, 0, 0);
			path.context(e);
			e.beginPath();
			for (const { f } of lakes) path(f);
			path.context(to);
			e.lineJoin = 'round';
			e.lineWidth = 3.2;
			e.strokeStyle = COL.targetEdge;
			e.stroke();
			e.globalCompositeOperation = 'destination-out';
			e.fill(); // nonzero: where two pieces overlap a little it's still lake; islands wind the other way, so they stay
			e.globalCompositeOperation = 'source-over';
			to.save();
			proj.precision(0.3);
			to.beginPath();
			const shown = trace(u.feature, u.m);
			proj.precision(0);
			if (shown) {
				to.clip();
				to.shadowColor = `rgba(${COL.glow}, 0.8)`;
				to.shadowBlur = 14;
				paste(shore);
			}
			to.restore();
		}
	}
	function drawOn(to, fn) {
		ctx = to.ctx;
		path.context(ctx);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, W, H);
		fn();
		ctx = screen;
		path.context(ctx);
	}
	const paste = (from) => {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.drawImage(from.c, 0, 0);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	};

	function draw(now) {
		raf = 0;
		stepFly(now);
		const t0 = performance.now();
		cap = Math.min(Math.PI / 2, viewCap() + 0.02);
		const lvl = level(), w = waterSet();
		const view_ = [cam.lon, cam.lat, cam.scale, W, H, dpr, lvl, w === water.high, moving && slow, openId, stamp, world.map((c) => view.country(c)).join()].join('|');
		if (view_ !== kept) {
			kept = view_;
			drawOn(under, () => drawUnder(lvl));
			drawOn(over, drawOver);
		}
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, W, H);
		ctx.lineJoin = 'round';
		paste(under);
		// the open country's subdivisions
		if (units.length) {
			if (Math.abs(tiny.scale / cam.scale - 1) > 0.04 || (!tiny.full && !moving)) {
				tiny = { scale: cam.scale, set: new Set(), full: !moving };
				const measurer = geoPath(proj);
				const box = units.map((u) => measurer.bounds(u.feature));
				const size = box.map(([[x0, y0], [x1, y1]]) => Math.max(x1 - x0, y1 - y0));
				size.forEach((s, i) => s < TINY && tiny.set.add(i));
				// a small unit wholly under its tiny neighbours' rings can't be clicked at all (Valletta among Malta's
				// councils): it gets a ring of its own, and a click picks the nearest ring
				// (or under a lake drawn over it: Likoma's islands in Lake Malawi)
				const clickable = (i, ringAt) => {
					const [[x0, y0], [x1, y1]] = box[i];
					const tries = [point(units[i].m.centre)]; // its middle first: that settles almost every unit
					for (let a = 0.5; a < 6; a++) for (let b = 0.5; b < 6; b++) tries.push([x0 + ((x1 - x0) * a) / 6, y0 + ((y1 - y0) * b) / 6]);
					for (const t of tries) {
						if (!t || ringAt.some((p) => (p[0] - t[0]) ** 2 + (p[1] - t[1]) ** 2 < (RING + 1.5) ** 2)) continue;
						const h = pickShape(t[0], t[1]);
						if (h && h.unit === i) return true; // a spot of its own to click
					}
					return false;
				};
				// (a few hundred clicks' worth of work, so it waits until the map stops moving)
				for (let grew = !moving; grew; ) {
					grew = false;
					const ringAt = [...tiny.set].map((i) => point(units[i].m.centre)).filter(Boolean);
					size.forEach((s, i) => {
						if (tiny.set.has(i) || s > 4 * TINY || !facing(units[i].m) || clickable(i, ringAt)) return;
						tiny.set.add(i);
						grew = true; // its ring may cover a neighbour in turn
					});
				}
			}
			ctx.lineWidth = 1;
			ctx.strokeStyle = COL.border;
			proj.precision(0.3); // a province's long straight border has few points: let d3 curve it with the globe
			units.forEach((u, i) => {
				if (!facing(u.m)) return;
				ctx.beginPath();
				if (!trace(u.feature, u.m)) return;
				ctx.fillStyle = view.fill(i);
				ctx.fill();
				ctx.stroke();
			});
			// The one being looked at or asked about, lit the way World Capitals lights a country: a blue
			// wash, a thin light edge and a soft glow. The edge sits on the border and is thin, so the
			// coast keeps its detail; the lakes go on top afterwards, so it never crosses water.
			for (const { i, fill } of view.lit()) {
				if (tiny.set.has(i) || !facing(units[i].m)) continue; // a tiny one lights its ring instead
				ctx.beginPath();
				if (!trace(units[i].feature, units[i].m)) continue;
				ctx.shadowColor = `rgba(${COL.glow}, 0.8)`;
				ctx.shadowBlur = 14;
				if (fill) {
					ctx.globalAlpha = 0.78;
					ctx.fillStyle = COL.target;
					ctx.fill();
					ctx.globalAlpha = 1;
				}
				ctx.lineWidth = 1.6;
				ctx.strokeStyle = COL.targetEdge;
				ctx.stroke();
				ctx.shadowBlur = 0;
			}
			proj.precision(0);
		}
		paste(over);
		// the lit province's lake shores: kept as a picture, since the glow is slow to draw and the shore
		// only changes with the view or the selection, not with a hover
		if (units.length) {
			const lit = view.lit().filter(({ i }) => !tiny.set.has(i) && facing(units[i].m));
			const key = view_ + '|' + lit.map(({ i }) => i).join();
			if (key !== shoreKept) {
				shoreKept = key;
				drawOn(shoreLit, () => drawShores(lit));
			}
			if (lit.length) paste(shoreLit);
		}
		drawShade();
		if (moving) {
			const ms = performance.now() - t0;
			if (ms > 24) slow = true;
			else if (ms < 8) slow = false;
		}
		if (units.length) {
			const lit = new Map(view.lit().map((l) => [l.i, l.fill]));
			rings = [];
			for (const i of tiny.set) {
				const pt = point(units[i].m.centre);
				if (!pt) continue;
				rings.push({ i, x: pt[0], y: pt[1] });
				ctx.beginPath();
				ctx.arc(pt[0], pt[1], RING, 0, Math.PI * 2);
				ctx.fillStyle = lit.get(i) ? COL.target : view.fill(i);
				ctx.globalAlpha = lit.get(i) ? 0.78 : 0.55;
				ctx.fill();
				ctx.globalAlpha = 1;
				ctx.lineWidth = lit.has(i) ? 2.2 : 1.3;
				ctx.strokeStyle = lit.has(i) ? COL.target : COL.ring;
				ctx.stroke();
			}
			drawLabels();
		} else rings = [];
		if (fly) {
			stir();
			invalidate();
		}
	}

	function drawLabels() {
		const callouts = view.callouts(); // [{ i, text }]
		const named = view.names() ? units.map((u, i) => i).sort((a, b) => units[b].m.area - units[a].m.area) : [];
		if (!callouts.length && !named.length) return;
		const small = W < 600;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		const taken = [];
		const place = (i, text, strong) => {
			const pt = point(units[i].m.centre);
			if (!pt) return;
			ctx.font = `${strong ? 700 : 600} ${strong ? (small ? 13 : 15) : small ? 10 : 11.5}px Archivo, "Helvetica Neue", Arial, sans-serif`;
			const w = ctx.measureText(text).width, h = strong ? 20 : 14;
			const y = pt[1] - (strong && tiny.set.has(i) ? RING + 14 : 0);
			const box = [pt[0] - w / 2 - 3, y - h / 2, pt[0] + w / 2 + 3, y + h / 2];
			if (!strong && taken.some((t) => box[0] < t[2] && box[2] > t[0] && box[1] < t[3] && box[3] > t[1])) return;
			taken.push(box);
			if (strong) {
				ctx.fillStyle = 'rgba(13, 20, 27, 0.9)';
				ctx.strokeStyle = COL.target;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.roundRect(box[0] - 5, box[1] - 3, box[2] - box[0] + 10, h + 6, 6);
				ctx.fill();
				ctx.stroke();
			} else {
				ctx.lineWidth = 3;
				ctx.strokeStyle = COL.labelHalo;
				ctx.strokeText(text, pt[0], y);
			}
			ctx.fillStyle = COL.label;
			ctx.fillText(text, pt[0], y);
		};
		for (const c of callouts) place(c.i, c.text, true);
		const skip = new Set(callouts.map((c) => c.i));
		for (const i of named) if (!skip.has(i)) place(i, units[i].feature.properties.name, false);
	}

	// lon/lat -> screen, or null when it's round the back of the globe
	function point(ll) {
		if (geoDistance(ll, [cam.lon, cam.lat]) > Math.PI / 2 - 0.01) return null;
		const p = proj(ll);
		return p && isFinite(p[0]) ? p : null;
	}

	// What's under a screen point: { unit } (index), { country } (id), { lake } (its name, '' if it has
	// none), { place, of } (land that is no country's: its name and whose it is) or null. As on World
	// Capitals, a lake is named instead of counting as the land around it; rivers are only scenery.
	function pick(x, y) {
		let best = null, bd = (RING + 1.5) ** 2;
		for (const r of rings) {
			const d = (r.x - x) ** 2 + (r.y - y) ** 2;
			if (d < bd) [best, bd] = [r.i, d];
		}
		if (best != null) return { unit: best };
		return pickShape(x, y);
	}
	// what a click picks if no ring takes it: a lake, a unit, another country or a place
	function pickShape(x, y) {
		const f = free();
		const cx = f.x0 + f.w / 2, cy = f.y0 + f.h / 2;
		if ((x - cx) ** 2 + (y - cy) ** 2 > cam.scale ** 2) return null; // off the globe
		const ll = proj.invert([x, y]);
		if (!ll || !isFinite(ll[0])) return null;
		const w = waterSet(), z = webZoom();
		for (const { f: lake, m } of w ? w.lakes : []) {
			if (lake.properties.mz <= z + LAKE_LEAD && geoDistance(m.centre, ll) < m.reach && geoContains(lake, ll)) return { lake: lake.properties.n || '' };
		}
		for (let i = 0; i < units.length; i++) {
			if (inBounds(units[i].m.bounds, ll) && geoContains(units[i].feature, ll)) return { unit: i };
		}
		for (const c of world) {
			if ((openId && c.id === openId) || !inBounds(c.m.bounds, ll) || !geoContains(c.feature, ll)) continue;
			return c.id ? { country: c.id } : { place: c.name, of: c.of };
		}
		return null;
	}

	/* ---------- dragging, zooming, clicking ---------- */
	const pointers = new Map();
	let drag = null, pinch = null, moved = false;
	const clampScale = (s) => Math.max(fitScale * 0.45, Math.min(fitScale * 16, s));
	function zoomBy(k) {
		fly = null;
		stir();
		cam.scale = clampScale(cam.scale * k);
		setProjection();
		invalidate();
	}
	canvas.addEventListener('pointerdown', (e) => {
		canvas.setPointerCapture(e.pointerId);
		pointers.set(e.pointerId, [e.clientX, e.clientY]);
		moved = false;
		fly = null;
		if (pointers.size === 1) drag = { x: e.clientX, y: e.clientY, lon: cam.lon, lat: cam.lat };
		else if (pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), scale: cam.scale };
			drag = null;
			moved = true;
		}
	});
	canvas.addEventListener('pointermove', (e) => {
		if (!pointers.has(e.pointerId)) {
			if (e.pointerType === 'mouse') onHover(pick(e.clientX, e.clientY));
			return;
		}
		pointers.set(e.pointerId, [e.clientX, e.clientY]);
		if (pinch && pointers.size === 2) {
			const [a, b] = [...pointers.values()];
			cam.scale = clampScale((pinch.scale * Math.hypot(a[0] - b[0], a[1] - b[1])) / pinch.d);
		} else if (drag) {
			const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
			if (!moved && Math.hypot(dx, dy) < 5) return;
			moved = true;
			canvas.parentElement.classList.add('dragging');
			const k = 1 / (cam.scale * DEG);
			cam.lon = drag.lon - dx * k;
			cam.lat = Math.max(-85, Math.min(85, drag.lat + dy * k));
		}
		stir();
		setProjection();
		invalidate();
	});
	const lift = (e) => {
		if (!pointers.has(e.pointerId)) return;
		pointers.delete(e.pointerId);
		canvas.parentElement.classList.remove('dragging');
		if (pointers.size < 2) pinch = null;
		if (!pointers.size) {
			if (!moved && e.type === 'pointerup') onClick(pick(e.clientX, e.clientY));
			drag = null;
		}
	};
	canvas.addEventListener('pointerup', lift);
	canvas.addEventListener('pointercancel', lift);
	canvas.addEventListener('pointerleave', () => onHover(null));
	canvas.addEventListener('wheel', (e) => {
		e.preventDefault();
		zoomBy(Math.exp(-e.deltaY * (e.deltaMode ? 0.03 : 0.0015)));
	}, { passive: false });
	window.addEventListener('resize', resize);

	return {
		resize, invalidate, frame, zoomBy, pick, point,
		setWorld(list) {
			world = list.map((c) => ({ ...c, m: measure(c.feature), detail: {} }));
			stamp++;
			invalidate();
		},
		// the same shapes in more detail ('mid' or 'high'), in the same order as setWorld's
		setWorldDetail(name, features) {
			if (features.length !== world.length) return;
			world.forEach((c, i) => (c.detail[name] = features[i]));
			stamp++;
			invalidate();
		},
		// name: 'low' or 'high'; lakes and rivers: GeoJSON features with properties mz (the zoom they show from) and r (rank)
		setWater(name, lakes, rivers) {
			water[name] = { lakes: lakes.map(measureWater), rivers: rivers.map(measureWater) };
			stamp++;
			invalidate();
		},
		// features: GeoJSON features with properties.name, or [] to close the country
		setUnits(features, countryId) {
			units = features.map((feature) => ({ feature, m: measure(feature) }));
			openId = features.length ? countryId : null;
			tiny = { scale: 0, set: new Set(), full: false };
			invalidate();
		},
		unitCentre: (i) => (units[i] ? point(units[i].m.centre) : null),
		lookAt(i) {
			// bring a unit into view if it's off screen or round the back
			const u = units[i];
			if (!u) return;
			const pt = point(u.m.centre), f = free();
			if (pt && pt[0] > f.x0 + 20 && pt[0] < f.x1 - 20 && pt[1] > f.y0 + 20 && pt[1] < f.y1 - 20) return;
			let dl = u.m.centre[0] - cam.lon;
			dl = ((dl + 540) % 360) - 180;
			fly = { from: { ...cam }, dl, to: { lon: u.m.centre[0], lat: Math.max(-85, Math.min(85, u.m.centre[1])), scale: cam.scale }, t0: performance.now(), ms: 450 };
			invalidate();
		},
		cam,
		state: () => ({ units: units.length, openId, tiny: [...tiny.set], scale: cam.scale, fitScale, level: level(), water: Object.keys(water).filter((k) => water[k]), asked: [...asked] }),
	};
}

return { COL, rewind, mainCluster, createMap };
})();
const { COL, rewind, mainCluster, createMap } = __MAP;

(function(){
// States & Provinces: pick a country, then learn its first-level subdivisions on the map.
// One state object, one named action per control. The quiz rules are in core/session.js, the
// answer checking in core/answer.js, the drawing in map.js. Data: data/index.json (the countries)
// and data/sub/<ID>.json (one country, loaded when it's picked); the world's country shapes are
// the World Capitals map's own files, so the borders are the same.
const $ = (id) => document.getElementById(id);
const saved = window.SiteProgress ? window.SiteProgress.tool('state-atlas') : { get: (k, d) => d, set() {} };

const STATE_I18N = {
	es: {
		title: 'Estados y Provincias',
		markA: 'ESTADOS ', markB: 'Y PROVINCIAS',
		sub: 'Aprende las regiones de cada país',
		pick_country: 'Elige un país',
		search_ph: 'Buscar un país',
		loading: 'Cargando…',
		mode: 'Modo',
		study: 'Estudiar', practice: 'Practicar', test: 'Examen',
		questions: 'Preguntas',
		click: 'Haz clic', type: 'Escribir el nombre',
		restart: 'Reiniciar',
		show_names: 'Mostrar nombres',
		reset_view: 'Restablecer vista',
		world: 'Mundo',
		close: 'Cerrar',
		countries_btn: 'Países', options_btn: 'Opciones',
		prev: '← Anterior', next: 'Siguiente →',
		skip: 'Saltar', show_me: 'Muéstramelo', enter: 'Entrar',
		type_ph: 'Escribe su nombre',
		right: 'correctas', misspelled: 'casi (½)', missed: 'falladas',
		again: 'Otra vez', practise_misses: 'Practicar los fallos', back_study: 'Volver a Estudiar',
		score: 'Puntos', time: 'Tiempo', streak: 'Racha', lang: 'Idioma',
		continents: {
			'north-america': 'América del Norte', 'south-america': 'América del Sur', 'asia': 'Asia',
			'europe': 'Europa', 'africa': 'África', 'oceania': 'Oceanía',
		},
		mode_hint: {
			study: 'Recorre las regiones con las flechas o haz clic en cualquiera para ver su nombre. Sin puntuación.',
			practice: 'Se pregunta cada región. Los fallos vuelven al final de la ronda.',
			test: 'Un intento por cada región, contra el reloj.',
		},
		format_hint: {
			study: 'Se usa en Practicar y Examen.',
			click: 'Te damos el nombre; haz clic en el mapa. Las regiones pequeñas tienen un anillo para hacer clic.',
			type: 'Una región se ilumina; escribe su nombre. Las tildes no importan y un pequeño error cuenta medio punto.',
		},
		which_lit: '¿Qué región está iluminada?',
		meta_world: (c, r, phone) => `${c} países · ${r} regiones · ${phone ? 'toca Países o un país en el globo' : 'haz clic en la lista o en el globo'}`,
		meta_quiz: (a, b, isClick) => `${a} de ${b} · ${isClick ? 'haz clic en el mapa' : 'escribe su nombre; Entrar vacío salta'}`,
		meta_study_none: (phone) => phone ? 'Toca una región para ver su nombre' : '← → para recorrerlas, o haz clic en cualquiera',
		best_here: (s, t, tm) => `Mejor marca: ${s}/${t} en ${tm}`,
		no_country: 'Ningún país con ese nombre.',
	},
	en: {
		title: 'States & Provinces',
		markA: 'STATES ', markB: '& PROVINCES',
		sub: 'Learn the regions of every country',
		pick_country: 'Pick a country',
		search_ph: 'Find a country',
		loading: 'Loading…',
		mode: 'Mode',
		study: 'Study', practice: 'Practice', test: 'Test',
		questions: 'Questions',
		click: 'Click it', type: 'Type its name',
		restart: 'Restart',
		show_names: 'Show all names',
		reset_view: 'Reset view',
		world: 'World',
		close: 'Close',
		countries_btn: 'Countries', options_btn: 'Options',
		prev: '← Previous', next: 'Next →',
		skip: 'Skip', show_me: 'Show me', enter: 'Enter',
		type_ph: 'Type its name',
		right: 'right', misspelled: 'misspelled (½)', missed: 'missed',
		again: 'Again', practise_misses: 'Practise the misses', back_study: 'Back to Study',
		score: 'Score', time: 'Time', streak: 'Streak', lang: 'Language',
		continents: {
			'north-america': 'North America', 'south-america': 'South America', 'asia': 'Asia',
			'europe': 'Europe', 'africa': 'Africa', 'oceania': 'Oceania',
		},
		mode_hint: {
			study: 'Step through the regions with the arrows, or click any one to see its name. No score.',
			practice: 'Every region is asked. Misses come back at the end of the round for another go.',
			test: 'One go at each region, against the clock.',
		},
		format_hint: {
			study: 'Used in Practice and Test.',
			click: 'You get a name; click it on the map. Tiny ones have a ring you can click.',
			type: 'A region lights up; type its name. Accents don’t matter, and a small spelling slip counts as half a point.',
		},
		which_lit: 'Which region is lit up?',
		meta_world: (c, r, phone) => `${c} countries · ${r} regions · ${phone ? 'tap Countries, or a country on the globe' : 'click one in the list or on the globe'}`,
		meta_quiz: (a, b, isClick) => `${a} of ${b} · ${isClick ? 'click it on the map' : 'type its name; Enter with nothing typed skips'}`,
		meta_study_none: (phone) => phone ? 'Tap a region to see its name' : '← → to step through them, or click any one',
		best_here: (s, t, tm) => `Best here: ${s}/${t} in ${tm}`,
		no_country: 'No country by that name.',
	}
};

function detectInitialLang() {
	let pick = null;
	try { pick = new URLSearchParams(location.search).get('lang'); } catch (e) {}
	if (!pick) { try { pick = localStorage.getItem('todologo.lang'); } catch (e) {} }
	if (!pick) { try { pick = JSON.parse(localStorage.getItem('ss1.state-atlas.lang')); } catch (e) {} }
	return pick || 'es';
}
let curLang = detectInitialLang();
const L = () => STATE_I18N[curLang] || (curLang === 'en' || curLang === 'de' ? STATE_I18N.en : STATE_I18N.es);
const CONTINENTS_KEYS = ['north-america', 'south-america', 'asia', 'europe', 'africa', 'oceania'];

function countryDisplayName(c) {
	if (!c) return '';
	const pack = window.__OFFLINE_CAP_DATA && window.__OFFLINE_CAP_DATA[`../capital-atlas/lang/${curLang}.json`];
	if (pack && pack.countries && pack.countries[c.id]) {
		const entry = pack.countries[c.id];
		return Array.isArray(entry) ? entry[0] : (entry.name || c.name);
	}
	return c.name;
}

const state = {
	countries: [], // [{ id, name, region, count, kind }]
	none: [], // countries with nothing to learn
	byId: new Map(),
	open: null, // the country being studied: { id, name, kind, units: [{ name, alts?, type? }] }
	mode: ['study', 'practice', 'test'].includes(saved.get('mode')) ? saved.get('mode') : 'study',
	format: saved.get('format') === 'type' ? 'type' : 'click',
	names: false, // Study: every name on the map
	selected: null, // Study and review: the unit being looked at
	session: null,
	review: null, // the finished round: { sum, ms, best }
	flash: null, // { i, color, until }
	hover: null,
	startedAt: 0,
	collapsed: new Set(),
};
const loaded = new Map(); // country id -> its data

const narrow = () => window.innerWidth <= 900;
function insets() {
	const pr = $('prompt').getBoundingClientRect();
	if (narrow()) return { left: 10, right: 10, top: pr.bottom + 10, bottom: 74 };
	const l = $('left').getBoundingClientRect(), r = $('right').getBoundingClientRect();
	return { left: l.right + 16, right: window.innerWidth - r.left + 16, top: pr.bottom + 14, bottom: 64 };
}

const view = {
	country: (c) => (!c.id ? COL.territory : state.open ? COL.other : state.byId.has(c.id) ? (state.hover && state.hover.country === c.id ? '#e2d8c0' : COL.land) : COL.landOff),
	fill(i) {
		const f = state.flash;
		if (f && f.i === i && performance.now() < f.until) return f.color;
		const s = state.session, shown = s || state.review;
		const r = shown && (state.review ? state.review.result : s.result).get(i);
		if (r) return r === 'ok' ? COL.ok : r === 'close' ? COL.close : COL.bad;
		return state.hover && state.hover.unit === i ? '#e2d8c0' : COL.land;
	},
	// the province lit up: the one being asked about (typing) or looked at. fill: washed blue all over;
	// in the results it keeps its right/wrong colour and only its edge lights
	lit() {
		const s = state.session;
		if (s && !state.review && s.format === 'type' && current(s) != null) return [{ i: current(s), fill: true }];
		return state.selected != null ? [{ i: state.selected, fill: !state.review }] : [];
	},
	callouts() {
		if (state.selected == null || !state.open) return [];
		if (state.session && !state.review) return [];
		return [{ i: state.selected, text: state.open.units[state.selected].name }];
	},
	names: () => state.names && state.mode === 'study' && !!state.open,
};

// The World Capitals map's other files, fetched when the map first wants them: its finer country
// shapes (zoomed in) and its lakes and rivers. A failed fetch only means the coarser picture stays.
const CAPITALS = '../capital-atlas/data/';
function fetchForMap(file) {
	window.__offlineFetchState(CAPITALS + file + '.json')
		.then((r) => r.json())
		.then((t) => {
			if (file.startsWith('water-')) map.setWater(file.slice(6), feature(t, t.objects.lakes).features, feature(t, t.objects.rivers).features);
			else map.setWorldDetail(file.slice(4), feature(t, t.objects.land).features);
		})
		.catch(() => {});
}
const map = createMap({ canvas: $('map'), insets, view, onClick: clickMap, onHover: hoverMap, need: fetchForMap });

/* ---------- small helpers ---------- */
let toastTimer = 0;
function toast(msg, kind = '') {
	const t = $('toast');
	t.textContent = msg;
	t.className = 'toast show ' + kind;
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
let pulseTimer = 0;
function pulse(kind) {
	const p = $('prompt');
	p.classList.remove('is-ok', 'is-bad', 'is-close');
	p.classList.add('is-' + kind);
	clearTimeout(pulseTimer);
	pulseTimer = setTimeout(() => p.classList.remove('is-ok', 'is-bad', 'is-close'), 600);
}
function flash(i, color, ms = 700) {
	state.flash = { i, color, until: performance.now() + ms };
	map.invalidate();
	setTimeout(() => map.invalidate(), ms + 30);
}
const clock = (ms) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;
const points = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const bestKey = () => `${state.open.id}|${state.mode}|${state.format}`;
const kindOne = () => (state.open.kind === 'subdivisions' ? 'region' : state.open.kind.replace(/ies$/, 'y').replace(/s$/, ''));

/* ---------- actions ---------- */
async function openCountry(id, { animate = true } = {}) {
	const meta = state.byId.get(id);
	if (!meta) return;
	setSheet(null);
	let data = loaded.get(id);
	if (!data) {
		$('pMeta').textContent = `Loading ${meta.name}…`;
		try {
			const res = await window.__offlineFetchState(`data/sub/${id}.json`);
			if (!res.ok) throw new Error(res.status);
			data = await res.json();
		} catch (err) {
			toast(`Couldn’t load ${meta.name}. Check your connection and try again.`, 'bad');
			render();
			return;
		}
		const fc = feature(data.topology, data.topology.objects.units);
		fc.features.forEach((f, i) => {
			f.properties = { name: data.units[i].name };
			rewind(f);
		});
		data.features = fc.features;
		// what the view is fitted to: the country without one or two far-off units
		const main = mainCluster(fc.features);
		data.shape = main.shape;
		data.far = main.far.map((i) => data.units[i].name).sort();
		loaded.set(id, data);
	}
	state.open = data;
	state.selected = null;
	state.session = state.review = null;
	saved.set('country', id);
	if (location.hash !== '#selftest') history.replaceState(null, '', '#' + id);
	map.setUnits(data.features, id);
	render(); // first, so the prompt has its real height when the view is fitted under it
	const row = $('list').querySelector('button[aria-pressed="true"]');
	if (row) row.scrollIntoView({ block: 'nearest' });
	map.frame(data.shape, animate);
	if (state.mode !== 'study') startRound();
}
function closeCountry() {
	state.open = null;
	state.selected = null;
	state.session = state.review = null;
	saved.set('country', null);
	if (location.hash !== '#selftest') history.replaceState(null, '', location.pathname);
	map.setUnits([], null);
	render();
	map.frame(null);
}
// Esc with a country open: back to the whole globe. A round with answers already in it asks for a second press first,
// so one stray key doesn't throw a test away.
let leaveAsked = -Infinity;
function escCountry() {
	const s = state.session;
	const midRound = s && !state.review && (s.result.size > 0 || s.wrongNow);
	if (midRound && performance.now() - leaveAsked > 3000) {
		leaveAsked = performance.now();
		toast('Press Esc again to leave this round.');
		return;
	}
	leaveAsked = -Infinity;
	closeCountry();
}
function setMode(mode) {
	state.mode = mode;
	saved.set('mode', mode);
	state.selected = null;
	state.session = state.review = null;
	if (state.open && mode !== 'study') startRound();
	else render();
}
function setFormat(format) {
	state.format = format;
	saved.set('format', format);
	if (state.open && state.mode !== 'study') startRound();
	else render();
}
function startRound(only = null) {
	state.session = newSession(state.open.units, { mode: state.mode, format: state.format, only });
	state.review = null;
	state.selected = null;
	state.startedAt = performance.now();
	render();
	showCurrent();
}
function showCurrent() {
	const s = state.session;
	if (!s || finished(s)) return;
	if (s.format === 'type') {
		map.lookAt(current(s));
		$('answer').value = '';
		if (!narrow() || document.activeElement === $('answer')) $('answer').focus({ preventScroll: true });
	}
	map.invalidate();
}
function endRound() {
	const s = state.session, sum = summary(s), ms = performance.now() - state.startedAt;
	const all = saved.get('best', {});
	const mine = { score: sum.score, total: sum.total, ms: Math.round(ms) };
	const whole = sum.total === state.open.units.length; // a "practise the misses" round doesn't count as a best
	const isBest = whole && better(mine, all[bestKey()]);
	if (isBest) {
		all[bestKey()] = mine;
		saved.set('best', all);
	}
	state.review = { sum, ms, result: s.result, isBest };
	state.selected = null;
	render();
}
// After any answer: feedback, then the next question or the results
function afterAnswer(res, pickedName) {
	const s = state.session, name = state.open.units[res.target].name;
	if (res.outcome === 'ok') {
		flash(res.target, COL.ok);
		pulse('ok');
	} else if (res.outcome === 'close') {
		flash(res.target, COL.close);
		pulse('close');
		toast(`Close: it’s spelled ${name}. Half a point.`, 'close');
	} else if (res.outcome === 'gaveup') {
		flash(res.target, COL.bad, 1100);
		map.lookAt(res.target);
		toast(s.format === 'type' ? `It’s ${name}.` : `${name} is here.`, 'bad');
	} else {
		pulse('bad');
		if (res.moved) {
			flash(res.target, COL.bad, 1100);
			toast(s.format === 'type' ? `It’s ${name}.` : `That’s ${pickedName}. ${name} is marked in red.`, 'bad');
		} else toast(s.format === 'type' ? 'Not that. Try again, or press Show me.' : `That’s ${pickedName}. Try again.`, 'bad');
	}
	if (finished(s)) endRound();
	else {
		render();
		if (res.moved) showCurrent();
	}
}
function clickMap(hit) {
	if (!hit) return;
	// the same words as World Capitals for a lake, and for land that is no country's (Greenland, Western Sahara)
	if (hit.lake != null) return toast(hit.lake ? `That’s ${hit.lake}.` : 'That’s a lake.');
	if (hit.place) return toast(`${hit.place}${hit.of && hit.of !== hit.place ? ` (${hit.of})` : ''} isn’t a country in this quiz.`);
	if (hit.country) {
		if (state.open) return; // while a country is open, the rest of the world is just background
		return openCountry(hit.country);
	}
	const i = hit.unit, s = state.session;
	if (s && !state.review) {
		if (s.format !== 'click') return;
		if (s.result.has(i) && s.result.get(i) !== 'bad' && current(s) !== i) return toast(`${state.open.units[i].name} is already done.`);
		const res = answerClick(s, i);
		if (res) afterAnswer(res, state.open.units[i].name);
		return;
	}
	state.selected = state.selected === i ? null : i;
	render();
}
function hoverMap(hit) {
	// only what a click would pick lights up: a province, or a country on the world view (not a lake, nor land that is no country's)
	const live = hit && (hit.unit != null ? !(state.session && !state.review && state.session.format === 'type') : hit.country ? !state.open : false);
	const next = live ? hit : null;
	if (JSON.stringify(next) === JSON.stringify(state.hover)) return;
	state.hover = next;
	$('stage').classList.toggle('hovering', !!next);
	map.invalidate();
}
function submitTyped() {
	const s = state.session;
	if (!s || state.review) return;
	const res = answerType(s, $('answer').value);
	if (!res) return;
	if (res.outcome === 'empty') return doSkip();
	if (res.moved || res.outcome === 'wrong') $('answer').select();
	afterAnswer(res);
}
function doSkip() {
	const s = state.session;
	if (!s || state.review) return;
	if (!skip(s)) return toast('That’s the last one left.');
	render();
	showCurrent();
}
function doGiveUp() {
	const s = state.session;
	if (!s || state.review) return;
	afterAnswer(giveUp(s));
}
function studyStep(d) {
	if (!state.open || (state.session && !state.review)) return;
	const n = state.open.units.length;
	state.selected = state.selected == null ? (d > 0 ? 0 : n - 1) : (state.selected + d + n) % n;
	map.lookAt(state.selected);
	render();
}
function setNames(on) {
	state.names = on;
	render();
}
function setSheet(which) {
	document.body.classList.toggle('sheet-countries', which === 'countries');
	document.body.classList.toggle('sheet-options', which === 'options');
}

/* ---------- drawing the page ---------- */
function applyStaticLang() {
	const d = L();
	document.documentElement.lang = curLang;
	document.title = d.title;
	if ($('brandMark')) $('brandMark').innerHTML = `${d.markA}<span>${d.markB}</span><sup>BETA</sup>`;
	if ($('brandSub')) $('brandSub').textContent = d.sub;
	if ($('lblPickCountry')) $('lblPickCountry').textContent = d.pick_country;
	if ($('search')) $('search').placeholder = d.search_ph;
	if ($('lblLang')) $('lblLang').textContent = d.lang;
	if ($('lblMode')) $('lblMode').textContent = d.mode;
	if ($('btnModeStudy')) $('btnModeStudy').textContent = d.study;
	if ($('btnModePractice')) $('btnModePractice').textContent = d.practice;
	if ($('btnModeTest')) $('btnModeTest').textContent = d.test;
	if ($('lblQuestions')) $('lblQuestions').textContent = d.questions;
	if ($('btnFmtClick')) $('btnFmtClick').textContent = d.click;
	if ($('btnFmtType')) $('btnFmtType').textContent = d.type;
	if ($('restartBtn')) $('restartBtn').textContent = d.restart;
	if ($('namesBtn')) $('namesBtn').textContent = d.show_names;
	if ($('resetView')) $('resetView').textContent = d.reset_view;
	if ($('worldBtn')) $('worldBtn').textContent = d.world;
	if ($('closeLeftBtn')) $('closeLeftBtn').textContent = d.close;
	if ($('closeRightBtn')) $('closeRightBtn').textContent = d.close;
	if ($('countriesBtn')) $('countriesBtn').textContent = d.countries_btn;
	if ($('optionsBtn')) $('optionsBtn').textContent = d.options_btn;
	if ($('prevBtn')) $('prevBtn').textContent = d.prev;
	if ($('nextBtn')) $('nextBtn').textContent = d.next;
	if ($('skipBtn')) $('skipBtn').textContent = d.skip;
	if ($('giveUpBtn')) $('giveUpBtn').textContent = d.show_me;
	if ($('enterBtn')) $('enterBtn').textContent = d.enter;
	if ($('answer')) $('answer').placeholder = d.type_ph;
	if ($('lblRight')) $('lblRight').textContent = d.right;
	if ($('lblClose')) $('lblClose').textContent = d.misspelled;
	if ($('lblBad')) $('lblBad').textContent = d.missed;
	if ($('againBtn')) $('againBtn').textContent = d.again;
	if ($('missedBtn')) $('missedBtn').textContent = d.practise_misses;
	if ($('studyBtn')) $('studyBtn').textContent = d.back_study;
	if ($('lblScore')) $('lblScore').textContent = d.score;
	if ($('lblTime')) $('lblTime').textContent = d.time;
	if ($('lblStreak')) $('lblStreak').textContent = d.streak;
	if ($('langSel')) $('langSel').value = curLang;
}

function renderList() {
	const d = L();
	const q = norm($('search').value).replace(/ /g, '');
	const frag = document.createDocumentFragment();
	for (const key of CONTINENTS_KEYS) {
		const label = d.continents[key] || key;
		const all = state.countries.filter((c) => c.region === key);
		const rows = all.filter((c) => !q || norm(countryDisplayName(c)).replace(/ /g, '').includes(q) || norm(c.name).replace(/ /g, '').includes(q));
		if (!rows.length) continue;
		const shut = !q && state.collapsed.has(key);
		const h = document.createElement('h3');
		const hb = document.createElement('button');
		hb.type = 'button';
		hb.dataset.group = key;
		hb.setAttribute('aria-expanded', String(!shut));
		hb.innerHTML = `<span>${label}</span><em>${rows.length}${shut ? ' ▸' : ''}</em>`;
		h.append(hb);
		frag.append(h);
		if (shut) continue;
		const ul = document.createElement('ul');
		for (const c of rows) {
			const li = document.createElement('li'), b = document.createElement('button');
			b.type = 'button';
			b.dataset.id = c.id;
			b.setAttribute('aria-pressed', String(!!state.open && state.open.id === c.id));
			const name = document.createElement('span'), n = document.createElement('em');
			name.textContent = countryDisplayName(c);
			n.textContent = c.count;
			b.append(name, n);
			li.append(b);
			ul.append(li);
		}
		frag.append(ul);
	}
	if (!frag.childNodes.length) {
		const p = document.createElement('p');
		p.className = 'none';
		p.textContent = d.no_country;
		frag.append(p);
	}
	$('list').replaceChildren(frag);
}
function renderPrompt() {
	const d = L();
	const o = state.open, s = state.session, rv = state.review;
	const quiz = !!s && !rv;
	$('answerForm').hidden = !(quiz && s.format === 'type');
	$('quizRow').hidden = !quiz;
	$('review').hidden = !rv;
	$('pBar').hidden = !quiz;
	$('prevBtn').hidden = $('nextBtn').hidden = !o || quiz;
	if (!o) {
		const total = state.countries.reduce((n, c) => n + c.count, 0);
		$('pEyebrow').textContent = d.title;
		$('pName').textContent = d.pick_country;
		$('pMeta').textContent = state.countries.length ? d.meta_world(state.countries.length, total.toLocaleString(curLang), narrow()) : d.loading;
		return;
	}
	const label = { study: d.study, practice: d.practice, test: d.test }[state.mode];
	$('pEyebrow').textContent = `${label} · ${countryDisplayName(o)}`;
	if (rv) {
		$('pName').textContent = `${points(rv.sum.score)} / ${rv.sum.total}`;
		const best = saved.get('best', {})[bestKey()];
		$('pMeta').textContent = `${clock(rv.ms)}${best ? ` · ${d.best_here(points(best.score), best.total, clock(best.ms))}` : ''}`;
		$('rOk').textContent = rv.sum.ok;
		$('rClose').textContent = rv.sum.close;
		$('rCloseKey').hidden = !rv.sum.close;
		$('rBad').textContent = rv.sum.bad;
		$('missedBtn').hidden = !rv.sum.missed.length;
		if (state.selected != null) $('pName').textContent = o.units[state.selected].name;
		return;
	}
	if (quiz) {
		const i = current(s), done = s.total - new Set(s.queue).size;
		$('pName').textContent = s.format === 'click' ? o.units[i].name : d.which_lit;
		$('pMeta').textContent = d.meta_quiz(Math.min(done + 1, s.total), s.total, s.format === 'click');
		$('pBarFill').style.width = `${(100 * done) / s.total}%`;
		return;
	}
	if (state.selected == null) {
		$('pName').textContent = `${o.units.length} ${o.kind}`;
		$('pMeta').textContent = d.meta_study_none(narrow());
	} else {
		const u = o.units[state.selected];
		$('pName').textContent = u.name;
		$('pMeta').textContent = `${state.selected + 1} / ${o.units.length}${u.type ? ' · ' + u.type : ''}${u.alts && u.alts.length ? ' · ' + u.alts.slice(0, 2).join(', ') : ''}`;
	}
}
function renderStats() {
	const s = state.session, rv = state.review;
	if (!s) {
		$('sScore').textContent = '–';
		$('sTime').textContent = '0:00';
		$('sStreak').textContent = '0';
		return;
	}
	const sum = summary(s);
	$('sScore').textContent = `${points(sum.score)}/${s.total}`;
	$('sTime').textContent = clock(rv ? rv.ms : performance.now() - state.startedAt);
	$('sStreak').textContent = s.streak;
}
function renderControls() {
	const d = L();
	for (const [id, v] of [['modeSeg', state.mode], ['formatSeg', state.format]]) {
		for (const b of $(id).querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.v === v));
	}
	$('modeHint').textContent = d.mode_hint[state.mode];
	$('formatHint').textContent = state.mode === 'study' ? d.format_hint.study : d.format_hint[state.format];
	$('restartBtn').disabled = !state.open || state.mode === 'study';
	$('namesBtn').disabled = !state.open || state.mode !== 'study';
	$('namesBtn').setAttribute('aria-pressed', String(view.names()));
	$('worldBtn').disabled = !state.open;
	const best = state.open && state.mode !== 'study' ? saved.get('best', {})[bestKey()] : null;
	$('bestLine').textContent = best ? d.best_here(points(best.score), best.total, clock(best.ms)) : '';
	$('bestLine').hidden = !best;
}
function render() {
	applyStaticLang();
	renderList();
	renderPrompt();
	renderStats();
	renderControls();
	map.invalidate();
}
if ($('langSel')) {
	$('langSel').addEventListener('change', (e) => {
		curLang = e.target.value;
		try {
			localStorage.setItem('todologo.lang', curLang);
			localStorage.setItem('ss1.state-atlas.lang', JSON.stringify(curLang));
			localStorage.setItem('ss1.capital-atlas.lang', JSON.stringify(curLang));
			localStorage.setItem('ss1.country-atlas.lang', JSON.stringify(curLang));
			localStorage.setItem('ss1.flag-atlas.lang', JSON.stringify(curLang));
		} catch (err) {}
		render();
	});
}
setInterval(() => {
	if (state.session && !state.review) renderStats();
}, 500);

/* ---------- controls ---------- */
$('list').addEventListener('click', (e) => {
	const g = e.target.closest('button[data-group]');
	if (g) {
		state.collapsed[state.collapsed.has(g.dataset.group) ? 'delete' : 'add'](g.dataset.group);
		return renderList();
	}
	const b = e.target.closest('button[data-id]');
	if (b) openCountry(b.dataset.id);
});
$('search').addEventListener('input', renderList);
$('modeSeg').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-v]');
	if (b && b.dataset.v !== state.mode) setMode(b.dataset.v);
});
$('formatSeg').addEventListener('click', (e) => {
	const b = e.target.closest('button[data-v]');
	if (b && b.dataset.v !== state.format) setFormat(b.dataset.v);
});
$('answerForm').addEventListener('submit', (e) => {
	e.preventDefault();
	submitTyped();
});
$('skipBtn').addEventListener('click', doSkip);
$('giveUpBtn').addEventListener('click', doGiveUp);
$('againBtn').addEventListener('click', () => startRound());
$('missedBtn').addEventListener('click', () => {
	const missed = state.review.sum.missed;
	state.mode = 'practice';
	saved.set('mode', 'practice');
	startRound(missed);
});
$('studyBtn').addEventListener('click', () => setMode('study'));
$('restartBtn').addEventListener('click', () => state.open && state.mode !== 'study' && startRound());
$('namesBtn').addEventListener('click', () => setNames(!state.names));
$('prevBtn').addEventListener('click', () => studyStep(-1));
$('nextBtn').addEventListener('click', () => studyStep(1));
$('zoomIn').addEventListener('click', () => map.zoomBy(1.4));
$('zoomOut').addEventListener('click', () => map.zoomBy(1 / 1.4));
$('resetView').addEventListener('click', () => map.frame(state.open ? state.open.shape : null));
$('worldBtn').addEventListener('click', closeCountry);
$('countriesBtn').addEventListener('click', () => setSheet('countries'));
$('optionsBtn').addEventListener('click', () => setSheet('options'));
for (const b of document.querySelectorAll('[data-close]')) b.addEventListener('click', () => setSheet(null));

document.addEventListener('keydown', (e) => {
	const typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
	if (e.key === 'Escape') {
		if (document.body.classList.contains('sheet-countries') || document.body.classList.contains('sheet-options')) setSheet(null);
		else if (state.selected != null) {
			state.selected = null;
			render();
		} else if (state.open) escCountry();
		else map.frame(null);
		return;
	}
	if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
	if (e.key === 'ArrowRight' || e.key === 'ArrowDown') studyStep(1);
	else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') studyStep(-1);
	else if (e.key === '+' || e.key === '=') map.zoomBy(1.25);
	else if (e.key === '-' || e.key === '_') map.zoomBy(1 / 1.25);
	else if ((e.key === 'n' || e.key === 'N') && !$('namesBtn').disabled) setNames(!state.names);
	else return;
	e.preventDefault();
});
window.addEventListener('resize', () => {
	if (!narrow()) setSheet(null);
});

/* ---------- start ---------- */
async function boot() {
	const [index, low] = await Promise.all([
		window.__offlineFetchState('data/index.json').then((r) => r.json()),
		window.__offlineFetchState(CAPITALS + 'map-low.json').then((r) => r.json()),
	]);
	state.countries = index.countries;
	state.none = index.none;
	state.byId = new Map(index.countries.map((c) => [c.id, c]));
	const names = new Map([...index.countries, ...index.none].map((c) => [c.id, c.name]));
	map.setWorld(feature(low, low.objects.land).features.map((f) => ({ id: f.properties.id || null, name: names.get(f.properties.id) || f.properties.name, of: f.properties.of, feature: f })));
	map.resize();
	render();
	map.frame(null, false);
	$('loading').hidden = true;
	fetchForMap('water-low');
	const want = /^#[A-Z]{3}$/.test(location.hash) ? location.hash.slice(1) : saved.get('country', null);
	if (want && state.byId.has(want)) await openCountry(want, { animate: false });
	if (location.hash === '#selftest') {
		window.__stateAtlas = { state, map, view, openCountry, closeCountry, setMode, setFormat, startRound, clickMap, studyStep, loaded, current, summary };
	}
}
boot().catch((err) => {
	console.error(err);
	$('loadingText').textContent = 'The map didn’t load. Check your connection and reload the page.';
});

})();
})();
