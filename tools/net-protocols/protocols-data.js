// Generated dataset — 48 network, web & infrastructure protocols across 4 families
window.PROTOCOLS_DATA = {
  "CATEGORIES": [
    {
      "id": "web-apis",
      "es": "Web, APIs y Tiempo Real",
      "en": "Web, APIs & Real-Time",
      "era": "12 protocolos"
    },
    {
      "id": "files-mail-remote",
      "es": "Archivos, Correo y Acceso Remoto",
      "en": "Files, Mail & Remote Access",
      "era": "12 protocolos"
    },
    {
      "id": "security-infra",
      "es": "Seguridad, DNS e Infraestructura",
      "en": "Security, DNS & Infrastructure",
      "era": "12 protocolos"
    },
    {
      "id": "transport-routing",
      "es": "Transporte, IP y Enrutamiento",
      "en": "Transport, IP & Routing",
      "era": "12 protocolos"
    }
  ],
  "LOOKALIKES": [
    ["https", "http", "http3-quic", "tls"],
    ["websocket", "grpc", "http", "mqtt"],
    ["webrtc-stun", "sip", "rtp", "rtsp"],
    ["ssh", "telnet", "sftp", "rdp"],
    ["ftp", "sftp", "ftps", "tftp"],
    ["smtp", "imap", "pop3"],
    ["dns", "doh-dot", "mdns", "dhcp"],
    ["ldap", "kerberos", "radius", "snmp"],
    ["tcp", "udp", "sctp", "wireguard"],
    ["ipv4", "ipv6", "icmp", "arp"],
    ["bgp", "ospf", "ipsec", "vlan-8021q", "stp-8021d"]
  ],
  "MODELS": [
    {
      "id": "https",
      "name": "HTTPS",
      "fullName": {
        "es": "Hypertext Transfer Protocol Secure (HTTP sobre TLS)",
        "en": "Hypertext Transfer Protocol Secure"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": {
        "es": "Capa 7 · Aplicación (+ TLS)",
        "en": "Layer 7 · Application (+ TLS)"
      },
      "transport": {
        "es": "TCP / UDP (HTTP/3)",
        "en": "TCP / UDP (HTTP/3)"
      },
      "port": "TCP/UDP 443",
      "portShort": ":443",
      "portAliases": ["443", "tcp 443", "udp 443", "tcp/udp 443", "puerto 443", "port 443"],
      "security": "secure",
      "securityLabel": {
        "es": "Cifrado TLS extremo a extremo",
        "en": "TLS Encrypted"
      },
      "rfc": "RFC 9110 / RFC 8446",
      "pop": true,
      "aka": ["HTTP over TLS", "HTTP Secure", "Hypertext Transfer Protocol Secure"],
      "wiki": "HTTPS",
      "nodes": {
        "a": { "es": "Navegador", "en": "Browser" },
        "b": { "es": "Servidor Web", "en": "Web Server" }
      },
      "flow": [
        { "dir": "ab", "es": "TCP SYN + TLS ClientHello (SNI, ALPN h2)", "en": "TCP SYN + TLS ClientHello (SNI, ALPN h2)" },
        { "dir": "ba", "es": "Certificado X.509 + TLS ServerHello (Finished)", "en": "X.509 Certificate + TLS ServerHello" },
        { "dir": "ab", "es": "GET /index.html cifrado (200 OK)", "en": "Encrypted GET /index.html (200 OK)" }
      ],
      "trace": {
        "es": "Client:51842 -> Server:443 [TLSv1.3] Application Data (GET cifrado)",
        "en": "Client:51842 -> Server:443 [TLSv1.3] Encrypted Application Data"
      },
      "fact": {
        "es": "Combina semántica HTTP (GET/POST, cabeceras, cookies) dentro de un túnel TLS que autentica al servidor mediante certificados X.509 e impide espionaje o manipulación.",
        "en": "Wraps HTTP semantics inside a TLS tunnel to authenticate the server with X.509 certificates and encrypt headers, paths, cookies, and payloads."
      }
    },
    {
      "id": "http",
      "name": "HTTP/1.1 & HTTP/2",
      "fullName": {
        "es": "Protocolo de Transferencia de Hipertexto (texto claro)",
        "en": "Hypertext Transfer Protocol (cleartext)"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Aplicación", "en": "Layer 7 · Application" },
      "transport": { "es": "TCP", "en": "TCP" },
      "port": "TCP 80",
      "portShort": ":80",
      "portAliases": ["80", "tcp 80", "puerto 80", "port 80", "8080"],
      "security": "plain",
      "securityLabel": { "es": "Sin cifrado (texto plano)", "en": "Cleartext / Unencrypted" },
      "rfc": "RFC 9110 / RFC 9112 / RFC 9113",
      "pop": true,
      "aka": ["HTTP", "HTTP/1.1", "HTTP/2", "HTTP 1.1", "HTTP 2", "Hypertext Transfer Protocol"],
      "wiki": "HTTP",
      "nodes": {
        "a": { "es": "Cliente Web", "en": "Web Client" },
        "b": { "es": "Servidor Web", "en": "Web Server" }
      },
      "flow": [
        { "dir": "ab", "es": "TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK)", "en": "TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK)" },
        { "dir": "ab", "es": "GET /api/data HTTP/1.1 · Host: example.org", "en": "GET /api/data HTTP/1.1 · Host: example.org" },
        { "dir": "ba", "es": "HTTP/1.1 200 OK · Content-Type: text/html", "en": "HTTP/1.1 200 OK · Content-Type: text/html" }
      ],
      "trace": {
        "es": "Client:49102 -> Server:80 [HTTP] GET /login HTTP/1.1 (texto legible)",
        "en": "Client:49102 -> Server:80 [HTTP] GET /login HTTP/1.1 (plaintext)"
      },
      "fact": {
        "es": "Protocolo sin estado petición/respuesta que dio vida a la Web. HTTP/2 introdujo multiplexación binaria de flujos en una sola conexión TCP, aunque hoy casi siempre redirige a 443.",
        "en": "Stateless request/response backbone of the Web. HTTP/2 added binary framing and multiplexed streams over one TCP connection, though plaintext :80 mostly redirects to HTTPS."
      }
    },
    {
      "id": "http3-quic",
      "name": "HTTP/3 (QUIC)",
      "fullName": {
        "es": "HTTP/3 sobre transporte multiplexado QUIC en UDP",
        "en": "HTTP/3 over QUIC Multiplexed UDP Transport"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 4–7 · QUIC + HTTP/3", "en": "Layer 4–7 · QUIC + HTTP/3" },
      "transport": { "es": "UDP (QUIC + TLS 1.3 integrado)", "en": "UDP (QUIC + built-in TLS 1.3)" },
      "port": "UDP 443 (QUIC)",
      "portShort": "UDP :443",
      "portAliases": ["443", "udp 443", "quic 443", "udp/443", "puerto 443"],
      "security": "secure",
      "securityLabel": { "es": "TLS 1.3 obligatorio en 1 RTT", "en": "Mandatory 1-RTT TLS 1.3" },
      "rfc": "RFC 9114 / RFC 9000",
      "pop": true,
      "aka": ["HTTP/3", "HTTP3", "QUIC", "HTTP 3"],
      "wiki": "HTTP/3",
      "nodes": {
        "a": { "es": "Cliente QUIC", "en": "QUIC Client" },
        "b": { "es": "Edge / CDN", "en": "Edge / CDN" }
      },
      "flow": [
        { "dir": "ab", "es": "QUIC Initial (UDP) + TLS 1.3 ClientHello (0-RTT / 1-RTT)", "en": "QUIC Initial (UDP) + TLS 1.3 ClientHello (0/1-RTT)" },
        { "dir": "ba", "es": "Handshake + Connection ID independiente de IP", "en": "Handshake + IP-independent Connection ID" },
        { "dir": "bi", "es": "Streams independientes sin bloqueo Head-of-Line", "en": "Independent streams without TCP Head-of-Line blocking" }
      ],
      "trace": {
        "es": "Client:55410 -> CDN:443 UDP/QUIC Initial · DCID=7f9a21 PKN=0",
        "en": "Client:55410 -> CDN:443 UDP/QUIC Initial · DCID=7f9a21 PKN=0"
      },
      "fact": {
        "es": "Reemplaza TCP por UDP con control de congestión, cifrado TLS 1.3 integrado y migración de red sin cortes (pasar de Wi-Fi a 5G sin reiniciar la descarga).",
        "en": "Replaces TCP with UDP-based congestion control, mandatory TLS 1.3, independent streams per object, and seamless connection migration from Wi-Fi to cellular."
      }
    },
    {
      "id": "websocket",
      "name": "WebSocket (WS / WSS)",
      "fullName": {
        "es": "Canal full-duplex persistente iniciado vía HTTP Upgrade",
        "en": "Persistent Full-Duplex Protocol via HTTP Upgrade"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Aplicación", "en": "Layer 7 · Application" },
      "transport": { "es": "TCP (o TLS)", "en": "TCP (or TLS)" },
      "port": "TCP 80 / 443 (WS/WSS)",
      "portShort": "80/443 WS",
      "portAliases": ["80", "443", "80 443", "tcp 80", "tcp 443"],
      "security": "secure",
      "securityLabel": { "es": "Cifrado en wss:// (TLS)", "en": "Encrypted via wss:// (TLS)" },
      "rfc": "RFC 6455",
      "pop": true,
      "aka": ["WebSocket", "WebSockets", "WS", "WSS"],
      "wiki": "WebSocket",
      "nodes": {
        "a": { "es": "App SPA", "en": "Web App" },
        "b": { "es": "Broker WS", "en": "WS Broker" }
      },
      "flow": [
        { "dir": "ab", "es": "GET /ws HTTP/1.1 · Upgrade: websocket", "en": "GET /ws HTTP/1.1 · Upgrade: websocket" },
        { "dir": "ba", "es": "101 Switching Protocols (Sec-WebSocket-Accept)", "en": "101 Switching Protocols (Sec-WebSocket-Accept)" },
        { "dir": "bi", "es": "Tramas binarias / JSON bidireccionales en tiempo real", "en": "Bidirectional full-duplex frames in real time" }
      ],
      "trace": {
        "es": "Server:443 -> Client HTTP/1.1 101 Switching Protocols [Upgrade: websocket]",
        "en": "Server:443 -> Client HTTP/1.1 101 Switching Protocols [Upgrade: websocket]"
      },
      "fact": {
        "es": "Arranca con un apretón HTTP estándar y cambia de protocolo con código 101 para permitir que servidor y navegador envíen mensajes simultáneos con sobrecarga mínima.",
        "en": "Starts as a standard HTTP Upgrade request returning 101 Switching Protocols, keeping one low-overhead full-duplex socket open for chats, tickers, and multiplayer games."
      }
    },
    {
      "id": "grpc",
      "name": "gRPC",
      "fullName": {
        "es": "Llamadas a Procedimiento Remoto binarias sobre HTTP/2",
        "en": "Google Remote Procedure Call over HTTP/2 & Protobuf"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · RPC sobre HTTP/2", "en": "Layer 7 · RPC over HTTP/2" },
      "transport": { "es": "TCP (HTTP/2 + TLS)", "en": "TCP (HTTP/2 + TLS)" },
      "port": "TCP 443 / 50051",
      "portShort": ":50051",
      "portAliases": ["50051", "443", "tcp 50051", "puerto 50051", "443 50051"],
      "security": "secure",
      "securityLabel": { "es": "Soporte nativo TLS / mTLS", "en": "TLS / mTLS native" },
      "rfc": "Protocol Buffers + RFC 9113",
      "pop": true,
      "aka": ["gRPC", "gRPC Protobuf"],
      "wiki": "GRPC",
      "nodes": {
        "a": { "es": "Microservicio A", "en": "Service A" },
        "b": { "es": "Microservicio B", "en": "Service B" }
      },
      "flow": [
        { "dir": "ab", "es": "HTTP/2 POST /pkg.Auth/Check · content-type: application/grpc", "en": "HTTP/2 POST /pkg.Auth/Check · application/grpc" },
        { "dir": "ab", "es": "DATA frame Protobuf binario (5-byte prefix + payload)", "en": "Binary Protobuf DATA frame (length-prefixed)" },
        { "dir": "ba", "es": "HEADERS + DATA + Trailers grpc-status: 0", "en": "HEADERS + DATA + Trailers grpc-status: 0" }
      ],
      "trace": {
        "es": "SvcA -> SvcB:50051 HTTP2 POST /Orders/Create [application/grpc+proto]",
        "en": "SvcA -> SvcB:50051 HTTP2 POST /Orders/Create [application/grpc+proto]"
      },
      "fact": {
        "es": "Estándar de microservicios: serializa contratos `.proto` en binario compacto y aprovecha streams HTTP/2 para llamadas unarias o streaming bidireccional con tipado fuerte.",
        "en": "High-performance microservice RPC framework serializing strongly typed Protocol Buffers over HTTP/2 streams with deadlines, cancellation, and mTLS."
      }
    },
    {
      "id": "webrtc-stun",
      "name": "WebRTC / STUN / TURN",
      "fullName": {
        "es": "Comunicación P2P en tiempo real con atravesamiento NAT",
        "en": "Web Real-Time Communication & NAT Traversal"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Media P2P / ICE", "en": "Layer 7 · P2P Media / ICE" },
      "transport": { "es": "UDP (DTLS + SRTP / SCTP)", "en": "UDP (DTLS + SRTP / SCTP)" },
      "port": "UDP 3478 / 5349",
      "portShort": ":3478",
      "portAliases": ["3478", "5349", "udp 3478", "3478 5349", "puerto 3478"],
      "security": "secure",
      "securityLabel": { "es": "Cifrado obligatorio DTLS-SRTP", "en": "Mandatory DTLS-SRTP" },
      "rfc": "RFC 8445 / RFC 8489 / RFC 8825",
      "pop": true,
      "aka": ["WebRTC", "STUN", "TURN", "ICE WebRTC"],
      "wiki": "WebRTC",
      "nodes": {
        "a": { "es": "Peer A", "en": "Peer A" },
        "b": { "es": "STUN / Peer B", "en": "STUN / Peer B" }
      },
      "flow": [
        { "dir": "ab", "es": "Binding Request STUN (descubrir IP/puerto público tras NAT)", "en": "STUN Binding Request (discover public NAT mapping)" },
        { "dir": "bi", "es": "ICE Connectivity Checks + DTLS Fingerprint", "en": "ICE Connectivity Checks + DTLS Fingerprint" },
        { "dir": "bi", "es": "Flujo P2P SRTP cifrado de audio/video y DataChannel", "en": "Encrypted P2P SRTP media & SCTP DataChannel" }
      ],
      "trace": {
        "es": "PeerA:54210 -> STUN:3478 Binding Request -> XOR-MAPPED-ADDRESS 190.12.x.x",
        "en": "PeerA:54210 -> STUN:3478 Binding Request -> XOR-MAPPED-ADDRESS"
      },
      "fact": {
        "es": "Permite videollamadas directas navegador-a-navegador sorteando firewalls mediante candidatos ICE/STUN (o relay TURN) y cifrando audio/video con DTLS-SRTP.",
        "en": "Enables direct browser-to-browser audio, video, and data channels across NAT routers via ICE/STUN/TURN and mandatory DTLS-SRTP encryption."
      }
    },
    {
      "id": "mqtt",
      "name": "MQTT",
      "fullName": {
        "es": "Transporte de Telemetría por Cola de Mensajes (Pub/Sub)",
        "en": "Message Queuing Telemetry Transport"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Pub/Sub IoT", "en": "Layer 7 · IoT Pub/Sub" },
      "transport": { "es": "TCP (o TLS)", "en": "TCP (or TLS)" },
      "port": "TCP 1883 / 8883",
      "portShort": ":1883",
      "portAliases": ["1883", "8883", "1883 8883", "tcp 1883", "puerto 1883"],
      "security": "control",
      "securityLabel": { "es": "1883 plano · 8883 sobre TLS", "en": "1883 plain · 8883 over TLS" },
      "rfc": "ISO/IEC 20922 · OASIS MQTT v5",
      "pop": true,
      "aka": ["MQTT", "MQ Telemetry Transport"],
      "wiki": "MQTT",
      "nodes": {
        "a": { "es": "Sensor IoT", "en": "IoT Sensor" },
        "b": { "es": "Broker", "en": "Broker" }
      },
      "flow": [
        { "dir": "ab", "es": "CONNECT (ClientID, KeepAlive=60s, LastWill)", "en": "CONNECT (ClientID, KeepAlive=60s, LWT)" },
        { "dir": "ab", "es": "SUBSCRIBE topic: 'planta/temp/#' (QoS 1)", "en": "SUBSCRIBE topic: 'plant/temp/#' (QoS 1)" },
        { "dir": "ba", "es": "PUBLISH + PUBACK con cabecera mínima de 2 bytes", "en": "PUBLISH + PUBACK with 2-byte fixed header" }
      ],
      "trace": {
        "es": "Sensor -> Broker:1883 [MQTT] Publish Message topic=casa/salon payload=22.4C",
        "en": "Sensor -> Broker:1883 [MQTT] Publish Message topic=home/room payload=22.4C"
      },
      "fact": {
        "es": "Rey del IoT por su encabezado fijo de solo 2 bytes, tres niveles de entrega QoS (0/1/2) y publicación por tópicos jerárquicos a través de un broker central.",
        "en": "Ultra-lightweight IoT publish/subscribe protocol with a 2-byte minimal header, hierarchical topics, and selectable QoS 0/1/2 delivery guarantees."
      }
    },
    {
      "id": "coap",
      "name": "CoAP",
      "fullName": {
        "es": "Protocolo de Aplicación Restringida (tipo HTTP en UDP)",
        "en": "Constrained Application Protocol"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · IoT REST/UDP", "en": "Layer 7 · IoT REST/UDP" },
      "transport": { "es": "UDP (o DTLS)", "en": "UDP (or DTLS)" },
      "port": "UDP 5683 / 5684",
      "portShort": ":5683",
      "portAliases": ["5683", "5684", "5683 5684", "udp 5683", "puerto 5683"],
      "security": "control",
      "securityLabel": { "es": "5683 UDP · 5684 DTLS", "en": "5683 UDP · 5684 DTLS" },
      "rfc": "RFC 7252",
      "pop": false,
      "aka": ["CoAP", "Constrained Application Protocol"],
      "wiki": "Constrained_Application_Protocol",
      "nodes": {
        "a": { "es": "Nodo Baja Potencia", "en": "Low-Power Node" },
        "b": { "es": "Gateway IoT", "en": "IoT Gateway" }
      },
      "flow": [
        { "dir": "ab", "es": "CON (Confirmable) GET coap://sensor/batt (MID=0x1a)", "en": "CON (Confirmable) GET /batt (MID=0x1a)" },
        { "dir": "ba", "es": "ACK 2.05 Content (piggybacked) · 4 bytes de header", "en": "ACK 2.05 Content (piggybacked) · 4-byte header" },
        { "dir": "ab", "es": "Observe: 0 para recibir notificaciones sin polling", "en": "Observe: 0 to subscribe to state updates" }
      ],
      "trace": {
        "es": "Mote:4120 -> GW:5683 UDP CoAP CON GET /sensors/humidity Token=0x4f",
        "en": "Mote:4120 -> GW:5683 UDP CoAP CON GET /sensors/humidity"
      },
      "fact": {
        "es": "Traduce el modelo REST (GET/POST/PUT/DELETE) a datagramas UDP diminutos de 4 bytes para microcontroladores de escasa RAM y redes de sensores.",
        "en": "Brings REST semantics (GET/POST/PUT/DELETE) onto compact 4-byte UDP packets designed for battery-powered microcontrollers."
      }
    },
    {
      "id": "sip",
      "name": "SIP",
      "fullName": {
        "es": "Protocolo de Iniciación de Sesión (VoIP / Telefonía IP)",
        "en": "Session Initiation Protocol"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Señalización VoIP", "en": "Layer 7 · VoIP Signaling" },
      "transport": { "es": "UDP / TCP / TLS", "en": "UDP / TCP / TLS" },
      "port": "UDP/TCP 5060 / 5061",
      "portShort": ":5060",
      "portAliases": ["5060", "5061", "5060 5061", "udp 5060", "tcp 5060", "puerto 5060"],
      "security": "control",
      "securityLabel": { "es": "5060 plano · 5061 SIPS (TLS)", "en": "5060 plain · 5061 SIPS (TLS)" },
      "rfc": "RFC 3261",
      "pop": true,
      "aka": ["SIP", "Session Initiation Protocol", "SIPS"],
      "wiki": "Session_Initiation_Protocol",
      "nodes": {
        "a": { "es": "Teléfono IP", "en": "IP Phone" },
        "b": { "es": "Centralita PBX", "en": "PBX Proxy" }
      },
      "flow": [
        { "dir": "ab", "es": "INVITE sip:ana@voz.net (con oferta SDP de códecs)", "en": "INVITE sip:ana@voice.net (with SDP codec offer)" },
        { "dir": "ba", "es": "180 Ringing -> 200 OK (puerto RTP acordado)", "en": "180 Ringing -> 200 OK (negotiated RTP port)" },
        { "dir": "ab", "es": "ACK -> inicia llamada multimedia -> BYE al colgar", "en": "ACK -> call starts -> BYE on hangup" }
      ],
      "trace": {
        "es": "Phone:5060 -> PBX:5060 [SIP/SDP] INVITE sip:102@pbx.local CSeq: 1",
        "en": "Phone:5060 -> PBX:5060 [SIP/SDP] INVITE sip:102@pbx.local"
      },
      "fact": {
        "es": "No transporta tu voz directamente: solo negocia la llamada (timbrado, transferencia y códecs vía SDP) con formato legible similar a HTTP.",
        "en": "Handles call setup, ringing, codec negotiation (via SDP), and teardown using HTTP-like text messages while handing off audio packets to RTP."
      }
    },
    {
      "id": "rtp",
      "name": "RTP",
      "fullName": {
        "es": "Protocolo de Transporte en Tiempo Real (flujo audio/video)",
        "en": "Real-time Transport Protocol"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Media en Tiempo Real", "en": "Layer 7 · Real-Time Media" },
      "transport": { "es": "UDP (sobre puertos dinámicos)", "en": "UDP (dynamic port range)" },
      "port": "UDP 16384–32767 (Dinámico)",
      "portShort": "UDP dyn",
      "portAliases": ["16384", "16384 32767", "udp dinamico", "dinamico", "dynamic", "rtp"],
      "security": "control",
      "securityLabel": { "es": "Plano o SRTP cifrado", "en": "Plain or SRTP encrypted" },
      "rfc": "RFC 3550",
      "pop": false,
      "aka": ["RTP", "Real-time Transport Protocol", "SRTP"],
      "wiki": "Real-time_Transport_Protocol",
      "nodes": {
        "a": { "es": "Emisor Audio/Video", "en": "Media Sender" },
        "b": { "es": "Receptor / MCU", "en": "Media Receiver" }
      },
      "flow": [
        { "dir": "ab", "es": "Paquetes UDP cada 20 ms · Seq=1042 Timestamp=160", "en": "UDP frames every 20 ms · Seq=1042 Timestamp=160" },
        { "dir": "ab", "es": "Payload Opus / H.264 sin retransmitir paquetes perdidos", "en": "Opus / H.264 payload with no TCP retransmit stall" },
        { "dir": "ba", "es": "RTCP Receiver Report (jitter y tasa de pérdida)", "en": "RTCP Receiver Report (jitter & loss telemetry)" }
      ],
      "trace": {
        "es": "HostA:18422 -> HostB:24108 UDP/RTP PT=111 (Opus) SSRC=0x91c2 Seq=318",
        "en": "HostA:18422 -> HostB:24108 UDP/RTP PT=111 (Opus) Seq=318"
      },
      "fact": {
        "es": "Prioriza baja latencia sobre fiabilidad absoluta: añade número de secuencia y marca temporal sobre UDP para reconstruir audio/video sin congelamientos por retransmisión.",
        "en": "Prioritizes low latency over retransmission: tags UDP audio/video frames with sequence numbers and timestamps while RTCP monitors jitter."
      }
    },
    {
      "id": "rtsp",
      "name": "RTSP",
      "fullName": {
        "es": "Protocolo de Streaming en Tiempo Real (control remoto CCTV)",
        "en": "Real-Time Streaming Protocol"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Control de Streaming", "en": "Layer 7 · Stream Control" },
      "transport": { "es": "TCP / UDP", "en": "TCP / UDP" },
      "port": "TCP/UDP 554",
      "portShort": ":554",
      "portAliases": ["554", "tcp 554", "udp 554", "puerto 554"],
      "security": "plain",
      "securityLabel": { "es": "Control remoto PLAY / PAUSE", "en": "PLAY / PAUSE control" },
      "rfc": "RFC 7826",
      "pop": false,
      "aka": ["RTSP", "Real-Time Streaming Protocol"],
      "wiki": "Real-Time_Streaming_Protocol",
      "nodes": {
        "a": { "es": "Reproductor / NVR", "en": "Player / NVR" },
        "b": { "es": "Cámara IP", "en": "IP Camera" }
      },
      "flow": [
        { "dir": "ab", "es": "DESCRIBE rtsp://cam/stream1 (obtiene perfil H.265)", "en": "DESCRIBE rtsp://cam/stream1 (fetches H.265 SDP)" },
        { "dir": "ab", "es": "SETUP Transport: RTP/AVP + PLAY Range: npt=0.0-", "en": "SETUP Transport: RTP/AVP + PLAY Range: npt=0.0-" },
        { "dir": "ba", "es": "Streaming continuo de video · PAUSE / TEARDOWN", "en": "Continuous video stream · PAUSE / TEARDOWN" }
      ],
      "trace": {
        "es": "NVR:51090 -> Cam:554 [RTSP] PLAY rtsp://192.168.1.50:554/live RTSP/1.0",
        "en": "NVR:51090 -> Cam:554 [RTSP] PLAY rtsp://192.168.1.50:554/live"
      },
      "fact": {
        "es": "Actúa como el control remoto de un reproductor de red (DESCRIBE, SETUP, PLAY, PAUSE, TEARDOWN) y es omnipresente en cámaras de videovigilancia IP.",
        "en": "Works like a network VCR remote (DESCRIBE, SETUP, PLAY, PAUSE, TEARDOWN) controlling multimedia streams—standard across IP security cameras and NVRs."
      }
    },
    {
      "id": "bittorrent",
      "name": "BitTorrent",
      "fullName": {
        "es": "Protocolo P2P de distribución por piezas y DHT",
        "en": "BitTorrent P2P Swarm & DHT Protocol"
      },
      "category": "web-apis",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Distribución P2P", "en": "Layer 7 · P2P Swarm" },
      "transport": { "es": "TCP / UDP (µTP)", "en": "TCP / UDP (uTP)" },
      "port": "TCP/UDP 6881–6889",
      "portShort": ":6881",
      "portAliases": ["6881", "6889", "6881 6889", "tcp 6881", "udp 6881", "puerto 6881"],
      "security": "control",
      "securityLabel": { "es": "Hash SHA-1/SHA-256 por pieza", "en": "Per-piece SHA integrity" },
      "rfc": "BEP-0003 / BEP-0005 (DHT)",
      "pop": false,
      "aka": ["BitTorrent", "Torrent", "uTP"],
      "wiki": "BitTorrent",
      "nodes": {
        "a": { "es": "Leecher", "en": "Leecher" },
        "b": { "es": "Seeders / DHT", "en": "Seeders / DHT" }
      },
      "flow": [
        { "dir": "bi", "es": "Tracker / DHT Kademlia (info_hash -> lista de peers)", "en": "Tracker / Kademlia DHT (info_hash -> peer list)" },
        { "dir": "bi", "es": "Peer Handshake + Bitfield de fragmentos disponibles", "en": "Peer Handshake + Bitfield of available pieces" },
        { "dir": "ba", "es": "Intercambio tit-for-tat (REQUEST -> PIECE verificada)", "en": "Tit-for-tat chunk swarm (REQUEST -> verified PIECE)" }
      ],
      "trace": {
        "es": "PeerA -> PeerB:6881 [BitTorrent] Piece index=0x004a begin=0 len=16384",
        "en": "PeerA -> PeerB:6881 [BitTorrent] Piece index=0x004a len=16384"
      },
      "fact": {
        "es": "Divide archivos grandes en piezas pequeñas verificadas por hash criptográfico, permitiendo descargar fragmentos raros simultáneamente desde cientos de pares.",
        "en": "Splits large distributions (e.g. Linux ISOs) into hash-verified pieces downloaded rarest-first across decentralized swarms using Kademlia DHT."
      }
    },

    {
      "id": "ssh",
      "name": "SSH",
      "fullName": {
        "es": "Intérprete de Comandos Seguro (Secure Shell)",
        "en": "Secure Shell"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Terminal Segura", "en": "Layer 7 · Encrypted Shell" },
      "transport": { "es": "TCP", "en": "TCP" },
      "port": "TCP 22",
      "portShort": ":22",
      "portAliases": ["22", "tcp 22", "puerto 22", "port 22"],
      "security": "secure",
      "securityLabel": { "es": "Cifrado Ed25519 / AES-GCM", "en": "Encrypted (Ed25519 / AES)" },
      "rfc": "RFC 4251 – RFC 4254",
      "pop": true,
      "aka": ["SSH", "Secure Shell", "SSH-2", "OpenSSH"],
      "wiki": "Secure_Shell",
      "nodes": {
        "a": { "es": "Admin", "en": "Admin" },
        "b": { "es": "Servidor Linux", "en": "Linux Host" }
      },
      "flow": [
        { "dir": "bi", "es": "Intercambio de banners SSH-2.0-OpenSSH + claves DH", "en": "SSH-2.0 banner exchange + Curve25519 key agreement" },
        { "dir": "ab", "es": "Autenticación con firma Ed25519 (clave pública sin password)", "en": "Ed25519 public-key challenge authentication" },
        { "dir": "bi", "es": "Canal multiplexado: shell PTY, reenvío X11 o túnel TCP", "en": "Encrypted multiplexed PTY shell & port forwarding" }
      ],
      "trace": {
        "es": "Admin:52014 -> Host:22 [SSHv2] Client: Key Exchange Init (curve25519-sha256)",
        "en": "Admin:52014 -> Host:22 [SSHv2] Key Exchange Init (curve25519-sha256)"
      },
      "fact": {
        "es": "Reemplazó por completo a Telnet y rlogin al cifrar sesiones interactivas, autenticación por pares de claves y túneles TCP locales o remotos.",
        "en": "Replaced Telnet for remote server administration by encrypting interactive shells, public-key login, and SOCKS/port-forwarding tunnels over TCP 22."
      }
    },
    {
      "id": "telnet",
      "name": "Telnet",
      "fullName": {
        "es": "Terminal Virtual de Red (texto claro obsoleto)",
        "en": "Teletype Network Protocol (cleartext)"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Terminal Remota", "en": "Layer 7 · Remote Terminal" },
      "transport": { "es": "TCP", "en": "TCP" },
      "port": "TCP 23",
      "portShort": ":23",
      "portAliases": ["23", "tcp 23", "puerto 23", "port 23"],
      "security": "plain",
      "securityLabel": { "es": "Sin cifrado (expone claves)", "en": "Cleartext (exposes passwords)" },
      "rfc": "RFC 854",
      "pop": true,
      "aka": ["Telnet"],
      "wiki": "Telnet",
      "nodes": {
        "a": { "es": "Cliente", "en": "Client" },
        "b": { "es": "Router Legacy", "en": "Legacy Switch" }
      },
      "flow": [
        { "dir": "ab", "es": "TCP Handshake + negociación IAC (DO ECHO, WILL SGA)", "en": "TCP Handshake + IAC options negotiation" },
        { "dir": "ba", "es": "Prompt: login: / Password: en ASCII sin cifrar", "en": "Plain ASCII login: / Password: prompt" },
        { "dir": "bi", "es": "Cada pulsación de teclado viaja en claro por la red", "en": "Every keystroke travels unencrypted on the wire" }
      ],
      "trace": {
        "es": "PC:50440 -> Switch:23 [TELNET] Data: admin\\r\\nsecret123\\r\\n",
        "en": "PC:50440 -> Switch:23 [TELNET] Cleartext Data: admin / secret123"
      },
      "fact": {
        "es": "Pionero de 1969 para consolas remotas; transmite usuarios, contraseñas y comandos tecla por tecla sin cifrado, por lo que hoy solo se ve en equipos aislados o tests.",
        "en": "Historic 1969 terminal protocol; transmits usernames and passwords in plain readable bytes, so modern networks replace it strictly with SSH."
      }
    },
    {
      "id": "ftp",
      "name": "FTP",
      "fullName": {
        "es": "Protocolo de Transferencia de Archivos (doble conexión)",
        "en": "File Transfer Protocol (dual channel)"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Transferencia Archivos", "en": "Layer 7 · File Transfer" },
      "transport": { "es": "TCP (Control 21 + Datos 20/PASV)", "en": "TCP (Control 21 + Data 20/PASV)" },
      "port": "TCP 21 / 20",
      "portShort": ":21 / 20",
      "portAliases": ["21", "20", "21 20", "20 21", "tcp 21", "puerto 21"],
      "security": "plain",
      "securityLabel": { "es": "Sin cifrado (comandos y datos)", "en": "Unencrypted control & data" },
      "rfc": "RFC 959",
      "pop": true,
      "aka": ["FTP", "File Transfer Protocol"],
      "wiki": "File_Transfer_Protocol",
      "nodes": {
        "a": { "es": "Cliente FTP", "en": "FTP Client" },
        "b": { "es": "Servidor FTP", "en": "FTP Server" }
      },
      "flow": [
        { "dir": "ab", "es": "USER / PASS en texto claro al puerto de control 21", "en": "Plaintext USER / PASS on control port 21" },
        { "dir": "ab", "es": "Modo Activo (PORT) o Pasivo (PASV -> 227 Entering Passive)", "en": "Active (PORT) or Passive mode (227 Entering Passive)" },
        { "dir": "ba", "es": "Transferencia RETR archivo.zip por canal de datos TCP aparte", "en": "Separate TCP data channel transfers payload" }
      ],
      "trace": {
        "es": "Client -> Server:21 [FTP] Request: USER deploy | PASS 12345 (plano)",
        "en": "Client -> Server:21 [FTP] Request: USER deploy | PASS 12345"
      },
      "fact": {
        "es": "Rasgo distintivo: usa DOS sockets TCP separados (control en puerto 21 y transferencia de archivos en puerto 20 activo o un puerto alto PASV).",
        "en": "Distinctive dual-connection design: port 21 carries ASCII commands/credentials in cleartext while a second TCP connection transfers files."
      }
    },
    {
      "id": "sftp",
      "name": "SFTP",
      "fullName": {
        "es": "Subsistema Seguro de Transferencia de Archivos SSH",
        "en": "SSH File Transfer Protocol"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Archivos sobre SSH", "en": "Layer 7 · Files over SSH" },
      "transport": { "es": "TCP (túnel único SSH)", "en": "TCP (single SSH tunnel)" },
      "port": "TCP 22 (SSH Subsistema)",
      "portShort": ":22 SSH",
      "portAliases": ["22", "tcp 22", "puerto 22", "22 ssh"],
      "security": "secure",
      "securityLabel": { "es": "Cifrado integral en 1 solo puerto", "en": "Single-port SSH encrypted" },
      "rfc": "IETF SecSh SFTP draft",
      "pop": true,
      "aka": ["SFTP", "SSH File Transfer Protocol", "Secure FTP over SSH"],
      "wiki": "SSH_File_Transfer_Protocol",
      "nodes": {
        "a": { "es": "Cliente SFTP", "en": "SFTP Client" },
        "b": { "es": "Daemon SSH", "en": "SSH Server" }
      },
      "flow": [
        { "dir": "bi", "es": "Sesión SSH cifrada estándar al puerto 22", "en": "Standard encrypted SSH handshake on port 22" },
        { "dir": "ab", "es": "Solicitud de subsistema: 'sftp' dentro del mismo canal", "en": "Channel subsystem request: 'sftp' inside SSH" },
        { "dir": "bi", "es": "Paquetes binarios SSH_FXP_OPEN / READ / WRITE", "en": "Binary SSH_FXP_OPEN / READ / WRITE frames" }
      ],
      "trace": {
        "es": "Client:54901 -> Server:22 [SSH/SFTP] Channel 0: Subsystem sftp (cifrado)",
        "en": "Client:54901 -> Server:22 [SSH/SFTP] Encrypted subsystem sftp"
      },
      "fact": {
        "es": "NO es 'FTP con TLS': es un protocolo binario completamente distinto montado dentro de SSH en un único puerto 22, fácil de atravesar firewalls sin modo PASV.",
        "en": "NOT 'FTP + TLS': it is an independent packetized file protocol running inside a single encrypted SSH connection, avoiding dual-port firewall pain."
      }
    },
    {
      "id": "ftps",
      "name": "FTPS",
      "fullName": {
        "es": "FTP Seguro sobre TLS/SSL (Explícito / Implícito)",
        "en": "FTP Secure over TLS/SSL"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · FTP + TLS", "en": "Layer 7 · FTP + TLS" },
      "transport": { "es": "TCP (Control + Datos TLS)", "en": "TCP (Control + Data TLS)" },
      "port": "TCP 990 / 21 (TLS)",
      "portShort": ":990 / 21",
      "portAliases": ["990", "21", "990 21", "21 990", "tcp 990", "puerto 990"],
      "security": "secure",
      "securityLabel": { "es": "Certificados X.509 + TLS", "en": "X.509 TLS encrypted" },
      "rfc": "RFC 4217",
      "pop": false,
      "aka": ["FTPS", "FTP over TLS", "FTP/TLS", "FTP-SSL"],
      "wiki": "FTPS",
      "nodes": {
        "a": { "es": "Cliente FTPS", "en": "FTPS Client" },
        "b": { "es": "Servidor FTP/TLS", "en": "FTP/TLS Server" }
      },
      "flow": [
        { "dir": "ab", "es": "Conexión al 990 (implícito) o 'AUTH TLS' en puerto 21", "en": "Connect to 990 (implicit) or 'AUTH TLS' on 21" },
        { "dir": "ab", "es": "PBSZ 0 + PROT P (exige cifrar también el canal de datos)", "en": "PBSZ 0 + PROT P (encrypt data channel too)" },
        { "dir": "ba", "es": "Canal PASV secundario cifrado con TLS para archivos", "en": "Secondary TLS-encrypted PASV file stream" }
      ],
      "trace": {
        "es": "Client -> Server:21 [FTP] AUTH TLS -> 234 Proceed with negotiation",
        "en": "Client -> Server:21 [FTP] AUTH TLS -> 234 TLS Handshake"
      },
      "fact": {
        "es": "Añade TLS y certificados X.509 al FTP clásico manteniendo sus comandos text-based (`USER`, `PASV`, `AUTH TLS`, `PROT P`) y doble canal TCP.",
        "en": "Adds TLS and X.509 server certificates directly to traditional dual-channel FTP via 'AUTH TLS' (port 21) or implicit TLS on port 990."
      }
    },
    {
      "id": "tftp",
      "name": "TFTP",
      "fullName": {
        "es": "Protocolo Trivial de Transferencia de Archivos (arranque PXE)",
        "en": "Trivial File Transfer Protocol"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Boot / Firmware", "en": "Layer 7 · Boot / Firmware" },
      "transport": { "es": "UDP (bloques de 512 B)", "en": "UDP (lock-step 512B)" },
      "port": "UDP 69",
      "portShort": ":69",
      "portAliases": ["69", "udp 69", "puerto 69", "port 69"],
      "security": "plain",
      "securityLabel": { "es": "Sin autenticación ni cifrado", "en": "No auth or encryption" },
      "rfc": "RFC 1350",
      "pop": false,
      "aka": ["TFTP", "Trivial File Transfer Protocol"],
      "wiki": "Trivial_File_Transfer_Protocol",
      "nodes": {
        "a": { "es": "Host Arranque PXE", "en": "PXE Boot Host" },
        "b": { "es": "Servidor Imágenes", "en": "Boot Server" }
      },
      "flow": [
        { "dir": "ab", "es": "RRQ 'pxelinux.0' octet (UDP al puerto 69)", "en": "RRQ 'pxelinux.0' mode=octet (UDP port 69)" },
        { "dir": "ba", "es": "DATA Block #1 (512 bytes) desde puerto TID efímero", "en": "DATA Block #1 (512 bytes) from ephemeral TID" },
        { "dir": "ab", "es": "ACK Block #1 -> parada-y-espera bloque a bloque", "en": "ACK Block #1 -> stop-and-wait lockstep transfer" }
      ],
      "trace": {
        "es": "Host:49152 -> Server:69 UDP [TFTP] Read Request, File: pxelinux.0",
        "en": "Host:49152 -> Server:69 UDP [TFTP] Read Request: pxelinux.0"
      },
      "fact": {
        "es": "Cabe en la memoria ROM mínima de una tarjeta de red: no lista directorios ni pide clave; solo lee/escribe archivos por UDP para arranque PXE o firmware Cisco.",
        "en": "Stripped-down UDP file loader with zero login or directory listing—small enough to live inside NIC ROMs for PXE OS netbooting and router firmware."
      }
    },
    {
      "id": "smtp",
      "name": "SMTP",
      "fullName": {
        "es": "Protocolo Simple de Transferencia de Correo (envío)",
        "en": "Simple Mail Transfer Protocol (sending)"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Envío de Correo", "en": "Layer 7 · Mail Submission/Relay" },
      "transport": { "es": "TCP (+ STARTTLS)", "en": "TCP (+ STARTTLS)" },
      "port": "TCP 25 / 587 / 465",
      "portShort": ":25 / 587",
      "portAliases": ["25", "587", "465", "25 587", "25 587 465", "tcp 25", "tcp 587", "puerto 25", "puerto 587"],
      "security": "control",
      "securityLabel": { "es": "STARTTLS (587) / SMTPS (465)", "en": "STARTTLS (587) / SMTPS (465)" },
      "rfc": "RFC 5321 / RFC 8314",
      "pop": true,
      "aka": ["SMTP", "SMTPS", "Simple Mail Transfer Protocol"],
      "wiki": "Simple_Mail_Transfer_Protocol",
      "nodes": {
        "a": { "es": "Cliente / MTA Origen", "en": "Client / Sender MTA" },
        "b": { "es": "Servidor Correo", "en": "Mail Relay (MTA)" }
      },
      "flow": [
        { "dir": "ba", "es": "220 mx.example.org ESMTP listo", "en": "220 mx.example.org ESMTP ready" },
        { "dir": "ab", "es": "EHLO -> STARTTLS -> AUTH LOGIN -> MAIL FROM / RCPT TO", "en": "EHLO -> STARTTLS -> AUTH -> MAIL FROM / RCPT TO" },
        { "dir": "ab", "es": "DATA (cabeceras + cuerpo MIME) + '.' -> 250 OK Queued", "en": "DATA (MIME headers + body) + '.' -> 250 OK" }
      ],
      "trace": {
        "es": "Sender:53211 -> MX:587 [SMTP] EHLO app.local | STARTTLS | RCPT TO:<ana@...>",
        "en": "Sender:53211 -> MX:587 [SMTP] EHLO app.local | RCPT TO:<ana@...>"
      },
      "fact": {
        "es": "Protocolo PUSH exclusivo para enviar o retransmitir correos: puerto 25 entre servidores MX, 587 para envío autenticado de clientes y 465 con TLS implícito.",
        "en": "Push-only email protocol: port 25 relays mail between MX servers, while port 587 (STARTTLS) and port 465 (implicit TLS) handle client submissions."
      }
    },
    {
      "id": "imap",
      "name": "IMAP",
      "fullName": {
        "es": "Protocolo de Acceso a Mensajes de Internet (sincronizado)",
        "en": "Internet Message Access Protocol"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Buzón Sincronizado", "en": "Layer 7 · Synced Mailbox" },
      "transport": { "es": "TCP (+ TLS)", "en": "TCP (+ TLS)" },
      "port": "TCP 143 / 993",
      "portShort": ":143 / 993",
      "portAliases": ["143", "993", "143 993", "tcp 143", "tcp 993", "puerto 993", "puerto 143"],
      "security": "secure",
      "securityLabel": { "es": "143 STARTTLS · 993 IMAPS", "en": "143 STARTTLS · 993 IMAPS" },
      "rfc": "RFC 9051",
      "pop": true,
      "aka": ["IMAP", "IMAPS", "IMAP4", "Internet Message Access Protocol"],
      "wiki": "Internet_Message_Access_Protocol",
      "nodes": {
        "a": { "es": "PC + Móvil", "en": "Phone + PC" },
        "b": { "es": "Buzón IMAP", "en": "IMAP Server" }
      },
      "flow": [
        { "dir": "ab", "es": "A01 LOGIN / AUTHENTICATE (TLS en puerto 993)", "en": "A01 LOGIN / AUTHENTICATE (TLS port 993)" },
        { "dir": "ab", "es": "A02 SELECT INBOX -> A03 FETCH 1:* (FLAGS BODY.PEEK)", "en": "A02 SELECT INBOX -> A03 FETCH (FLAGS)" },
        { "dir": "bi", "es": "IDLE en vivo: carpetas y estado 'Leído' sincronizados", "en": "Live IDLE push: folders & Read flags synced" }
      ],
      "trace": {
        "es": "MailApp -> MailHost:993 [TLS/IMAP] A03 UID FETCH 401 (BODY[HEADER])",
        "en": "MailApp -> MailHost:993 [TLS/IMAP] A03 UID FETCH 401"
      },
      "fact": {
        "es": "Mantiene los correos y carpetas en el servidor para consultar el mismo buzón sincronizado en el teléfono, la laptop y webmail en tiempo real.",
        "en": "Keeps emails, folders, and read/flagged state synchronized on the server so phones, laptops, and webmail stay identical."
      }
    },
    {
      "id": "pop3",
      "name": "POP3",
      "fullName": {
        "es": "Protocolo de Oficina Postal v3 (descarga local)",
        "en": "Post Office Protocol v3"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Descarga de Buzón", "en": "Layer 7 · Mail Download" },
      "transport": { "es": "TCP (+ TLS)", "en": "TCP (+ TLS)" },
      "port": "TCP 110 / 995",
      "portShort": ":110 / 995",
      "portAliases": ["110", "995", "110 995", "tcp 110", "tcp 995", "puerto 110", "puerto 995"],
      "security": "control",
      "securityLabel": { "es": "110 plano · 995 POP3S (TLS)", "en": "110 plain · 995 POP3S" },
      "rfc": "RFC 1939 / RFC 8314",
      "pop": false,
      "aka": ["POP3", "POP3S", "Post Office Protocol"],
      "wiki": "Post_Office_Protocol",
      "nodes": {
        "a": { "es": "Cliente Correo", "en": "Mail Client" },
        "b": { "es": "Buzón POP3", "en": "POP3 Mailbox" }
      },
      "flow": [
        { "dir": "ab", "es": "USER ana -> +OK -> PASS ***** -> LIST", "en": "USER ana -> +OK -> PASS ***** -> LIST" },
        { "dir": "ba", "es": "RETR 1..5 descarga mensajes completos al disco local", "en": "RETR 1..5 pulls full messages to local storage" },
        { "dir": "ab", "es": "DELE 1..5 + QUIT (tradicionalmente borra el servidor)", "en": "DELE 1..5 + QUIT (classically clears server)" }
      ],
      "trace": {
        "es": "Client -> POP:110 [POP] +OK 3 messages | RETR 1 | DELE 1 | QUIT",
        "en": "Client -> POP:110 [POP] +OK | RETR 1 | DELE 1 | QUIT"
      },
      "fact": {
        "es": "Modelo clásico de buzón: descarga los mensajes a tu equipo y suele borrarlos del servidor, sin sincronizar carpetas ni estado entre múltiples dispositivos.",
        "en": "Simple download-and-usually-delete mailbox protocol: pulls mail into local storage without multi-device folder synchronization."
      }
    },
    {
      "id": "rdp",
      "name": "RDP",
      "fullName": {
        "es": "Protocolo de Escritorio Remoto (Windows Remote Desktop)",
        "en": "Remote Desktop Protocol"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Escritorio Gráfico", "en": "Layer 7 · Remote GUI" },
      "transport": { "es": "TCP / UDP", "en": "TCP / UDP" },
      "port": "TCP/UDP 3389",
      "portShort": ":3389",
      "portAliases": ["3389", "tcp 3389", "udp 3389", "puerto 3389"],
      "security": "secure",
      "securityLabel": { "es": "TLS + NLA (CredSSP)", "en": "TLS + NLA auth" },
      "rfc": "MS-RDPBCGR",
      "pop": true,
      "aka": ["RDP", "Remote Desktop Protocol", "Escritorio Remoto"],
      "wiki": "Remote_Desktop_Protocol",
      "nodes": {
        "a": { "es": "Visor MSTSC", "en": "RDP Viewer" },
        "b": { "es": "Host Windows", "en": "Windows Host" }
      },
      "flow": [
        { "dir": "ab", "es": "X.224 Connection Request + CredSSP / NLA pre-login", "en": "X.224 Connection Request + CredSSP NLA" },
        { "dir": "bi", "es": "Negociación TLS + resolución gráfica y canales virtuales", "en": "TLS negotiation + display capability setup" },
        { "dir": "bi", "es": "Gráficos H.264/RemoteFX hacia cliente, mouse/audio al host", "en": "Screen frames down · keyboard/mouse/USB up" }
      ],
      "trace": {
        "es": "Client:60122 -> WinSrv:3389 [TPKT/RDP] X.224 Cookie: mstshash=admin",
        "en": "Client:60122 -> WinSrv:3389 [RDP] X.224 Connection Request"
      },
      "fact": {
        "es": "Puerto 3389, el más escaneado por bots en Internet si se expone sin VPN/RD Gateway: transmite sesiones gráficas, portapapeles, impresoras y audio bidireccional.",
        "en": "Streams graphical Windows desktop sessions, audio, and clipboard redirection over 3389—always recommended behind a VPN or RD Gateway."
      }
    },
    {
      "id": "smb",
      "name": "SMB / CIFS",
      "fullName": {
        "es": "Bloque de Mensajes del Servidor (Carpetas Compartidas)",
        "en": "Server Message Block (File Shares)"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Archivos en Red LAN", "en": "Layer 7 · LAN File Sharing" },
      "transport": { "es": "TCP (Directo 445)", "en": "TCP (Direct 445)" },
      "port": "TCP 445",
      "portShort": ":445",
      "portAliases": ["445", "tcp 445", "puerto 445"],
      "security": "control",
      "securityLabel": { "es": "SMB 3.x firma y cifrado AES", "en": "SMB 3.x signing & AES" },
      "rfc": "MS-SMB2 (SMB 3.1.1)",
      "pop": true,
      "aka": ["SMB", "CIFS", "SMB3", "Samba", "Server Message Block"],
      "wiki": "Server_Message_Block",
      "nodes": {
        "a": { "es": "PC Windows / Samba", "en": "Windows / Samba Client" },
        "b": { "es": "NAS / File Server", "en": "File Server / NAS" }
      },
      "flow": [
        { "dir": "ab", "es": "NEGOTIATE Dialect 0x0311 (SMB 3.1.1) + Session Setup Kerberos", "en": "NEGOTIATE SMB 3.1.1 + Kerberos/NTLM auth" },
        { "dir": "ab", "es": "TREE_CONNECT \\\\servidor\\Compartida", "en": "TREE_CONNECT \\\\server\\Share" },
        { "dir": "bi", "es": "CREATE / READ / WRITE bloques con bloqueo oportunista", "en": "File CREATE / READ / WRITE with oplocks" }
      ],
      "trace": {
        "es": "PC -> NAS:445 [SMB2/3] Tree Connect Request Tree: \\\\NAS\\Docs",
        "en": "PC -> NAS:445 [SMB2/3] Tree Connect \\\\NAS\\Docs"
      },
      "fact": {
        "es": "Columna de recursos compartidos `\\\\servidor\\carpeta` en Windows y Samba/macOS. Nunca debe abrirse directo a Internet; en LAN SMB 3.1.1 cifra y firma cada bloque.",
        "en": "Powers Windows network shares (`\\\\host\\share`) and macOS/Linux Samba over TCP 445; SMB 3.x adds AES-GCM encryption and integrity signing."
      }
    },
    {
      "id": "nfs",
      "name": "NFS",
      "fullName": {
        "es": "Sistema de Archivos de Red (UNIX / Linux)",
        "en": "Network File System (UNIX / Linux)"
      },
      "category": "files-mail-remote",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Sistema Archivos POSIX", "en": "Layer 7 · POSIX File Mount" },
      "transport": { "es": "TCP / UDP (NFSv4 en 2049)", "en": "TCP / UDP (NFSv4 on 2049)" },
      "port": "TCP/UDP 2049",
      "portShort": ":2049",
      "portAliases": ["2049", "tcp 2049", "udp 2049", "puerto 2049"],
      "security": "control",
      "securityLabel": { "es": "SYS UID o Kerberos (krb5p)", "en": "AUTH_SYS or Kerberos krb5p" },
      "rfc": "RFC 7530 / RFC 8881 (NFSv4)",
      "pop": false,
      "aka": ["NFS", "NFSv4", "Network File System"],
      "wiki": "Network_File_System",
      "nodes": {
        "a": { "es": "Nodo Linux / K8s", "en": "Linux / K8s Node" },
        "b": { "es": "Storage Array", "en": "NFS Storage" }
      },
      "flow": [
        { "dir": "ab", "es": "ONC-RPC COMPOUND PUTROOTFH + LOOKUP '/exports/data'", "en": "ONC-RPC COMPOUND PUTROOTFH + LOOKUP" },
        { "dir": "ba", "es": "Devuelve FileHandle opaco y permisos POSIX UID/GID", "en": "Returns opaque FileHandle + POSIX UID/GID" },
        { "dir": "bi", "es": "Lectura/escritura transparente montada en árbol local", "en": "Transparent read/write as mounted local directory" }
      ],
      "trace": {
        "es": "Worker -> NAS:2049 [NFSv4] COMPOUND Call LOOKUP 'volumes/db'",
        "en": "Worker -> NAS:2049 [NFSv4] COMPOUND LOOKUP 'volumes/db'"
      },
      "fact": {
        "es": "Estándar UNIX/Linux para montar discos remotos como si fueran carpetas locales (`/mnt/shared`); NFSv4 consolidó todo el tráfico en un único puerto 2049.",
        "en": "Allows Linux/UNIX hosts and clusters to mount remote volumes transparently; NFSv4 unified mounting and locking onto a single TCP 2049 port."
      }
    },

    {
      "id": "tls",
      "name": "TLS 1.3 (SSL)",
      "fullName": {
        "es": "Seguridad de la Capa de Transporte (sucesor de SSL)",
        "en": "Transport Layer Security (successor to SSL)"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 5–6/7 · Criptografía", "en": "Layer 5–6/7 · Cryptography" },
      "transport": { "es": "Sobre TCP (443, 465, 993…)", "en": "Over TCP (443, 465, 993…)" },
      "port": "Capa 6 · Sobre TCP (443 / +)",
      "portShort": "TLS :443+",
      "portAliases": ["443", "capa 6", "layer 6", "l6", "sobre tcp", "over tcp", "tls 443"],
      "security": "secure",
      "securityLabel": { "es": "Forward Secrecy (AEAD)", "en": "Perfect Forward Secrecy" },
      "rfc": "RFC 8446",
      "pop": true,
      "aka": ["TLS", "TLS 1.3", "TLS 1.2", "SSL", "SSL/TLS", "Transport Layer Security"],
      "wiki": "Transport_Layer_Security",
      "nodes": {
        "a": { "es": "Cliente", "en": "Client" },
        "b": { "es": "Servidor", "en": "Server" }
      },
      "flow": [
        { "dir": "ab", "es": "ClientHello (X25519 key_share, cifrados TLS_AES_128_GCM)", "en": "ClientHello (X25519 key_share, cipher suites)" },
        { "dir": "ba", "es": "ServerHello + Certificado firmado por CA + Finished (1-RTT)", "en": "ServerHello + CA Certificate + Finished (1-RTT)" },
        { "dir": "bi", "es": "Todo Application Data cifrado con llaves efímeras ECDHE", "en": "All Application Data encrypted with ephemeral keys" }
      ],
      "trace": {
        "es": "Client -> Server [TLSv1.3] Handshake ClientHello SNI=api.site KeyShare=x25519",
        "en": "Client -> Server [TLSv1.3] ClientHello SNI=api.site KeyShare=x25519"
      },
      "fact": {
        "es": "Envuelve y blinda protocolos en claro (HTTP->HTTPS, SMTP->SMTPS, IMAP->IMAPS). TLS 1.3 redujo el handshake a 1 solo viaje ida y vuelta y eliminó algoritmos débiles.",
        "en": "Cryptographic envelope turning plaintext protocols into secure ones (HTTPS, FTPS, IMAPS); TLS 1.3 cut negotiation to 1 RTT with mandatory forward secrecy."
      }
    },
    {
      "id": "dns",
      "name": "DNS",
      "fullName": {
        "es": "Sistema de Nombres de Dominio (resolución IP)",
        "en": "Domain Name System"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Resolución Nombres", "en": "Layer 7 · Name Resolution" },
      "transport": { "es": "UDP (consultas) / TCP (AXFR)", "en": "UDP (queries) / TCP (large)" },
      "port": "UDP/TCP 53",
      "portShort": ":53",
      "portAliases": ["53", "udp 53", "tcp 53", "udp/tcp 53", "puerto 53"],
      "security": "plain",
      "securityLabel": { "es": "UDP plano (firmable DNSSEC)", "en": "Plain UDP (signable DNSSEC)" },
      "rfc": "RFC 1034 / RFC 1035",
      "pop": true,
      "aka": ["DNS", "Domain Name System"],
      "wiki": "Domain_Name_System",
      "nodes": {
        "a": { "es": "Resolver Stub", "en": "Stub Resolver" },
        "b": { "es": "Servidor DNS", "en": "DNS Resolver" }
      },
      "flow": [
        { "dir": "ab", "es": "Query A / AAAA: ¿cuál es la IP de todologo.app?", "en": "Standard Query A/AAAA: todologo.app?" },
        { "dir": "ba", "es": "Recursión Root (.) -> TLD (.app) -> Autoritativo", "en": "Recursion Root -> TLD -> Authoritative NS" },
        { "dir": "ba", "es": "Answer A 104.21.xx.xx (TTL 300s) + registros MX/TXT", "en": "Response A 104.21.xx.xx (TTL 300s)" }
      ],
      "trace": {
        "es": "PC:53102 -> 1.1.1.1:53 [DNS] Standard query 0x8b1a A www.example.org",
        "en": "PC:53102 -> 1.1.1.1:53 [DNS] Query A www.example.org"
      },
      "fact": {
        "es": "La 'agenda telefónica' distribuida de Internet: traduce nombres legibles en registros A (IPv4), AAAA (IPv6), MX (correo), NS y TXT usando UDP 53 (o TCP 53 si supera 512B/AXFR).",
        "en": "Internet's hierarchical phonebook mapping domains to A/AAAA IPs, MX mail exchangers, NS records, and TXT proofs over UDP 53 (or TCP 53)."
      }
    },
    {
      "id": "doh-dot",
      "name": "DoH / DoT (DNS cifrado)",
      "fullName": {
        "es": "DNS sobre HTTPS (443) y DNS sobre TLS (853)",
        "en": "DNS over HTTPS & DNS over TLS"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · DNS Privado", "en": "Layer 7 · Encrypted DNS" },
      "transport": { "es": "TCP (HTTPS 443 / TLS 853)", "en": "TCP (HTTPS 443 / TLS 853)" },
      "port": "TCP 443 (DoH) / 853 (DoT)",
      "portShort": ":853 / 443",
      "portAliases": ["853", "443", "853 443", "443 853", "tcp 853", "puerto 853"],
      "security": "secure",
      "securityLabel": { "es": "Oculta dominios consultados", "en": "Hides queried hostnames" },
      "rfc": "RFC 8484 (DoH) / RFC 7858 (DoT)",
      "pop": true,
      "aka": ["DoH", "DoT", "DNS over HTTPS", "DNS over TLS"],
      "wiki": "DNS_over_HTTPS",
      "nodes": {
        "a": { "es": "Navegador / SO", "en": "Browser / OS" },
        "b": { "es": "Resolver DoH/DoT", "en": "DoH/DoT Resolver" }
      },
      "flow": [
        { "dir": "bi", "es": "Sesión TLS verificada al puerto 853 (DoT) o 443 (DoH)", "en": "Verified TLS session on 853 (DoT) or 443 (DoH)" },
        { "dir": "ab", "es": "POST /dns-query (application/dns-message) dentro de TLS", "en": "Encrypted POST /dns-query (wireformat)" },
        { "dir": "ba", "es": "Respuesta IP invisible para el ISP o Wi-Fi pública", "en": "Encrypted IP answer hidden from ISP / public Wi-Fi" }
      ],
      "trace": {
        "es": "Browser -> dns.google:443 [DoH TLSv1.3] POST /dns-query [200 OK]",
        "en": "Browser -> 1.1.1.1:853 [TLS/DNS] Encrypted DNS Query"
      },
      "fact": {
        "es": "Evita que terceros en una red Wi-Fi o proveedor ISP lean o secuestren qué sitios resuelves: DoT usa un puerto dedicado (853) y DoH se camufla en tráfico HTTPS (443).",
        "en": "Prevents ISP or local Wi-Fi eavesdroppers from snooping or tampering with DNS lookups: DoT runs on dedicated TCP 853, while DoH blends into HTTPS port 443."
      }
    },
    {
      "id": "mdns",
      "name": "mDNS (Bonjour / Zeroconf)",
      "fullName": {
        "es": "DNS Multicast para descubrimiento local sin servidor",
        "en": "Multicast DNS (Local Discovery)"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Descubrimiento LAN", "en": "Layer 7 · LAN Discovery" },
      "transport": { "es": "UDP Multicast 224.0.0.251", "en": "UDP Multicast 224.0.0.251" },
      "port": "UDP 5353",
      "portShort": ":5353",
      "portAliases": ["5353", "udp 5353", "puerto 5353"],
      "security": "control",
      "securityLabel": { "es": "Solo subred local (.local)", "en": "Local subnet only (.local)" },
      "rfc": "RFC 6762",
      "pop": false,
      "aka": ["mDNS", "Multicast DNS", "Bonjour", "Avahi", "Zeroconf"],
      "wiki": "Multicast_DNS",
      "nodes": {
        "a": { "es": "Laptop", "en": "Laptop" },
        "b": { "es": "Impresora .local", "en": "Printer .local" }
      },
      "flow": [
        { "dir": "ab", "es": "Multicast a 224.0.0.251:5353 -> ¿quién es impresora.local?", "en": "Multicast to 224.0.0.251:5353 -> who has printer.local?" },
        { "dir": "ba", "es": "Dispositivo responde directo su IP + servicios DNS-SD", "en": "Device replies directly with local IP + DNS-SD" },
        { "dir": "bi", "es": "Cero configuración previa ni servidor DNS central", "en": "Zero-config plug-and-play without central DNS" }
      ],
      "trace": {
        "es": "Host -> 224.0.0.251:5353 [MDNS] PTR _ipp._tcp.local | impresora.local",
        "en": "Host -> 224.0.0.251:5353 [MDNS] Query impresora.local"
      },
      "fact": {
        "es": "Permite que impresoras Wi-Fi, Chromecast, AirPlay y dispositivos con dominio `.local` se anuncien y descubran automáticamente dentro de la red doméstica.",
        "en": "Powers Apple Bonjour, Avahi, Chromecast, and `.local` printers by broadcasting queries to UDP multicast 224.0.0.251:5353 with zero server setup."
      }
    },
    {
      "id": "dhcp",
      "name": "DHCP",
      "fullName": {
        "es": "Protocolo de Configuración Dinámica de Host (DORA)",
        "en": "Dynamic Host Configuration Protocol (DORA)"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Asignación de IP", "en": "Layer 7 · IP Lease" },
      "transport": { "es": "UDP (Broadcast L2/L3)", "en": "UDP (Broadcast)" },
      "port": "UDP 67 (Srv) / 68 (Cli)",
      "portShort": ":67 / 68",
      "portAliases": ["67", "68", "67 68", "68 67", "udp 67", "udp 68", "puerto 67", "puerto 68"],
      "security": "control",
      "securityLabel": { "es": "Concesión automática (DORA)", "en": "Automatic lease (DORA)" },
      "rfc": "RFC 2131",
      "pop": true,
      "aka": ["DHCP", "Dynamic Host Configuration Protocol"],
      "wiki": "Dynamic_Host_Configuration_Protocol",
      "nodes": {
        "a": { "es": "Cliente (0.0.0.0)", "en": "Client (0.0.0.0)" },
        "b": { "es": "Servidor DHCP", "en": "DHCP Server" }
      },
      "flow": [
        { "dir": "ab", "es": "1. DISCOVER (broadcast 255.255.255.255) · 2. OFFER 192.168.1.40", "en": "1. DISCOVER (broadcast) -> 2. OFFER 192.168.1.40" },
        { "dir": "ab", "es": "3. REQUEST aceptando IP ofrecida · Gateway · DNS", "en": "3. REQUEST accepting offered IP / Gateway / DNS" },
        { "dir": "ba", "es": "4. ACK confirma concesión (Lease Time = 24h)", "en": "4. ACK confirms lease (Lease Time = 24h)" }
      ],
      "trace": {
        "es": "0.0.0.0:68 -> 255.255.255.255:67 [DHCP] Discover -> Offer 192.168.1.40",
        "en": "0.0.0.0:68 -> 255.255.255.255:67 [DHCP] Discover / Offer / Ack"
      },
      "fact": {
        "es": "Recuerda el acrónimo DORA (Discover, Offer, Request, Ack): entrega automáticamente IP, máscara, puerta de enlace y DNS al conectar cualquier equipo a una red.",
        "en": "Remember D-O-R-A (Discover, Offer, Request, Ack): automatically assigns an IP address, subnet mask, default gateway, and DNS servers upon join."
      }
    },
    {
      "id": "ntp",
      "name": "NTP",
      "fullName": {
        "es": "Protocolo de Tiempo de Red (relojes atómicos)",
        "en": "Network Time Protocol"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Sincronización Hora", "en": "Layer 7 · Clock Sync" },
      "transport": { "es": "UDP", "en": "UDP" },
      "port": "UDP 123",
      "portShort": ":123",
      "portAliases": ["123", "udp 123", "puerto 123"],
      "security": "control",
      "securityLabel": { "es": "Crítico para TLS y logs", "en": "Critical for TLS & logs" },
      "rfc": "RFC 5905",
      "pop": true,
      "aka": ["NTP", "Network Time Protocol", "SNTP"],
      "wiki": "Network_Time_Protocol",
      "nodes": {
        "a": { "es": "Host", "en": "Host" },
        "b": { "es": "Servidor Stratum 1/2", "en": "Stratum 1/2 Server" }
      },
      "flow": [
        { "dir": "ab", "es": "Paquete Cliente UDP con timestamp T1 de salida", "en": "Client UDP request carrying originate timestamp T1" },
        { "dir": "ba", "es": "Servidor devuelve T2 (recepción) y T3 (envío atómico)", "en": "Server returns T2 receive & T3 atomic transmit times" },
        { "dir": "bi", "es": "Ajuste sub-milisegundo descontando retardo de ida/vuelta", "en": "Sub-millisecond clock skew & RTT offset correction" }
      ],
      "trace": {
        "es": "Host:123 -> pool.ntp.org:123 [NTP] NTPv4 Client Stratum=0 -> Server Stratum=2",
        "en": "Host:123 -> pool.ntp.org:123 [NTP] v4 Stratum 2 offset=-0.4ms"
      },
      "fact": {
        "es": "Sincroniza los relojes mediante jerarquía Stratum; sin NTP en hora correcta fallan certificados TLS, tokens OTP/TOTP, Kerberos y logs distribuidos.",
        "en": "Keeps clocks aligned across Stratum tiers to millisecond precision; wrong system clocks break TLS certificate validation, Kerberos tickets, and TOTP."
      }
    },
    {
      "id": "snmp",
      "name": "SNMP",
      "fullName": {
        "es": "Protocolo Simple de Administración de Red (MIB / Traps)",
        "en": "Simple Network Management Protocol"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Monitoreo de Red", "en": "Layer 7 · Network Telemetry" },
      "transport": { "es": "UDP (161 consultas / 162 alertas)", "en": "UDP (161 poll / 162 traps)" },
      "port": "UDP 161 / 162",
      "portShort": ":161 / 162",
      "portAliases": ["161", "162", "161 162", "udp 161", "puerto 161"],
      "security": "control",
      "securityLabel": { "es": "v1/v2c texto · v3 cifrado AES", "en": "v1/v2c plain · v3 AES encrypted" },
      "rfc": "RFC 3411 – RFC 3418",
      "pop": false,
      "aka": ["SNMP", "SNMPv3", "Simple Network Management Protocol"],
      "wiki": "Simple_Network_Management_Protocol",
      "nodes": {
        "a": { "es": "Monitor NMS", "en": "NMS Monitor" },
        "b": { "es": "Agente Switch", "en": "Switch Agent" }
      },
      "flow": [
        { "dir": "ab", "es": "GET / GETNEXT OID 1.3.6.1.2.1.2.2 (tráfico interfaz)", "en": "GET / GETBULK OID 1.3.6.1.2.1.2.2 (ifInOctets)" },
        { "dir": "ba", "es": "GET-RESPONSE con contadores de bytes/CPU/temperatura", "en": "GET-RESPONSE reporting bytes/CPU/temp counters" },
        { "dir": "ba", "es": "TRAP asíncrono al puerto 162 ante caída de enlace", "en": "Async TRAP to UDP 162 on link-down alert" }
      ],
      "trace": {
        "es": "NMS -> CoreSw:161 [SNMPv3] get-request 1.3.6.1.2.1.1.3.0 (sysUpTime)",
        "en": "NMS -> CoreSw:161 [SNMP] get-request OID 1.3.6.1.2.1.1.3.0"
      },
      "fact": {
        "es": "Permite consultar variables OID en árbol MIB de routers, switches e impresoras por puerto 161, mientras los agentes envían alarmas (Traps) por el 162.",
        "en": "Polls device MIB metrics (OID trees) over UDP 161 for switches, routers, and UPS units, while devices send asynchronous alert Traps to UDP 162."
      }
    },
    {
      "id": "syslog",
      "name": "Syslog",
      "fullName": {
        "es": "Protocolo Estándar de Registro de Eventos y Logs",
        "en": "System Logging Protocol"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Auditoría y Logs", "en": "Layer 7 · Event Logging" },
      "transport": { "es": "UDP 514 / TCP TLS 6514", "en": "UDP 514 / TLS 6514" },
      "port": "UDP 514 / TLS 6514",
      "portShort": ":514",
      "portAliases": ["514", "6514", "514 6514", "udp 514", "puerto 514"],
      "security": "control",
      "securityLabel": { "es": "514 UDP · 6514 Syslog-TLS", "en": "514 UDP · 6514 Syslog-TLS" },
      "rfc": "RFC 5424",
      "pop": false,
      "aka": ["Syslog", "Rsyslog"],
      "wiki": "Syslog",
      "nodes": {
        "a": { "es": "Firewall / Server", "en": "Firewall / Server" },
        "b": { "es": "Colector SIEM", "en": "SIEM Collector" }
      },
      "flow": [
        { "dir": "ab", "es": "Prioridad PRI (<134> Facility=local0 Severity=Info)", "en": "PRI <134> (Facility + Severity 0..7)" },
        { "dir": "ab", "es": "Cabecera RFC 5424 ISO-timestamp + Hostname + AppName", "en": "RFC 5424 timestamp, hostname & structured data" },
        { "dir": "ab", "es": "Envío continuo sin saturar origen hacia SIEM central", "en": "Fire-and-forget log stream to central SIEM" }
      ],
      "trace": {
        "es": "FW:40912 -> SIEM:514 [SYSLOG] <38> auth.info sshd: Accepted publickey",
        "en": "FW -> SIEM:514 [SYSLOG] <38> auth.info Accepted publickey"
      },
      "fact": {
        "es": "Separa el almacenamiento de bitácoras de los equipos origen enviando severidades (Emergency=0 hasta Debug=7) hacia un colector SIEM o syslog central.",
        "en": "Forwards structured operational and security logs (severities 0–7) off devices onto a central collector or SIEM over UDP 514 or TLS 6514."
      }
    },
    {
      "id": "ldap",
      "name": "LDAP / LDAPS",
      "fullName": {
        "es": "Protocolo Ligero de Acceso a Directorios (Active Directory)",
        "en": "Lightweight Directory Access Protocol"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · Directorio Identidades", "en": "Layer 7 · Identity Directory" },
      "transport": { "es": "TCP", "en": "TCP" },
      "port": "TCP 389 / 636",
      "portShort": ":389 / 636",
      "portAliases": ["389", "636", "389 636", "tcp 389", "tcp 636", "puerto 389", "puerto 636"],
      "security": "control",
      "securityLabel": { "es": "389 STARTTLS · 636 LDAPS", "en": "389 STARTTLS · 636 LDAPS" },
      "rfc": "RFC 4511",
      "pop": false,
      "aka": ["LDAP", "LDAPS", "Lightweight Directory Access Protocol"],
      "wiki": "Lightweight_Directory_Access_Protocol",
      "nodes": {
        "a": { "es": "App Corporativa", "en": "Enterprise App" },
        "b": { "es": "Directorio AD/OpenLDAP", "en": "AD / OpenLDAP" }
      },
      "flow": [
        { "dir": "ab", "es": "bindRequest (uid=admin,ou=users,dc=empresa,dc=com)", "en": "bindRequest (DN + credentials or TLS cert)" },
        { "dir": "ab", "es": "searchRequest BaseDN Filtro: (memberOf=CN=DevOps)", "en": "searchRequest BaseDN Filter: (memberOf=CN=DevOps)" },
        { "dir": "ba", "es": "searchResEntry codificado en binario ASN.1 BER", "en": "ASN.1 BER encoded searchResEntry attributes" }
      ],
      "trace": {
        "es": "App:48120 -> DC01:636 [TLS/LDAP] searchRequest '(sAMAccountName=jdoe)'",
        "en": "App -> DC01:636 [TLS/LDAP] searchRequest '(sAMAccountName=jdoe)'"
      },
      "fact": {
        "es": "Base de Active Directory y OpenLDAP para autenticar usuarios corporativos y consultar árboles jerárquicos (DC, OU, CN) por el puerto 389 o 636 cifrado.",
        "en": "Backbone of Active Directory and OpenLDAP for corporate user authentication and hierarchical attribute lookups (DC/OU/CN) on TCP 389 / LDAPS 636."
      }
    },
    {
      "id": "kerberos",
      "name": "Kerberos",
      "fullName": {
        "es": "Protocolo de Autenticación por Tickets KDC (SSO)",
        "en": "Kerberos Ticket-Based Authentication"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · SSO / Tickets KDC", "en": "Layer 7 · SSO Tickets" },
      "transport": { "es": "TCP / UDP", "en": "TCP / UDP" },
      "port": "TCP/UDP 88",
      "portShort": ":88",
      "portAliases": ["88", "tcp 88", "udp 88", "puerto 88"],
      "security": "secure",
      "securityLabel": { "es": "Tickets simétricos sin password en red", "en": "Encrypted tickets (no wire pw)" },
      "rfc": "RFC 4120",
      "pop": false,
      "aka": ["Kerberos", "KRB5"],
      "wiki": "Kerberos_(protocol)",
      "nodes": {
        "a": { "es": "Estación Usuario", "en": "Workstation" },
        "b": { "es": "KDC (AS / TGS)", "en": "KDC (AS / TGS)" }
      },
      "flow": [
        { "dir": "bi", "es": "AS-REQ -> AS-REP entrega TGT (Ticket Granting Ticket)", "en": "AS-REQ -> AS-REP issues TGT (Ticket Granting Ticket)" },
        { "dir": "bi", "es": "TGS-REQ (TGT + SPN HTTP/intranet) -> Ticket de Servicio", "en": "TGS-REQ + SPN -> Service Ticket returned" },
        { "dir": "ab", "es": "AP-REQ presenta Ticket al servidor sin reenviar clave", "en": "AP-REQ presents ticket without sending password" }
      ],
      "trace": {
        "es": "PC -> KDC:88 [KRB5] TGS-REQ Server Name (Principal): cifs/fs01.corp",
        "en": "PC -> KDC:88 [KRB5] TGS-REQ Principal: cifs/fs01.corp"
      },
      "fact": {
        "es": "Habilita el Single Sign-On corporativo sin enviar tu contraseña a cada servicio: el KDC emite tickets cifrados y con caducidad estricta (exige reloj NTP exacto).",
        "en": "Provides enterprise Single Sign-On without sending passwords to target servers; relies on symmetric KDC tickets with strict timestamp anti-replay windows."
      }
    },
    {
      "id": "radius",
      "name": "RADIUS",
      "fullName": {
        "es": "Servicio de Autenticación Remota Dial-In / Wi-Fi 802.1X",
        "en": "Remote Authentication Dial-In User Service (AAA)"
      },
      "category": "security-infra",
      "osi": 7,
      "osiLabel": { "es": "Capa 7 · AAA / Wi-Fi 802.1X", "en": "Layer 7 · AAA / Wi-Fi 802.1X" },
      "transport": { "es": "UDP (1812 Auth / 1813 Acct)", "en": "UDP (1812 Auth / 1813 Acct)" },
      "port": "UDP 1812 / 1813",
      "portShort": ":1812",
      "portAliases": ["1812", "1813", "1812 1813", "udp 1812", "puerto 1812"],
      "security": "control",
      "securityLabel": { "es": "Shared Secret / RadSec TLS", "en": "Shared Secret / RadSec" },
      "rfc": "RFC 2865 / RFC 2866",
      "pop": false,
      "aka": ["RADIUS"],
      "wiki": "RADIUS",
      "nodes": {
        "a": { "es": "AP Wi-Fi / Switch (NAS)", "en": "Wi-Fi AP / Switch (NAS)" },
        "b": { "es": "Servidor AAA", "en": "AAA Server" }
      },
      "flow": [
        { "dir": "ab", "es": "Access-Request (User-Name, EAP-TLS / atributo AVP)", "en": "Access-Request (User-Name / EAP attributes)" },
        { "dir": "ba", "es": "Access-Challenge <-> Access-Accept (+ VLAN asignada)", "en": "Access-Challenge <-> Access-Accept (+ VLAN tag)" },
        { "dir": "ab", "es": "Accounting-Request Start/Stop al puerto 1813", "en": "Accounting-Request Start/Stop to port 1813" }
      ],
      "trace": {
        "es": "AP_WiFi -> AAA:1812 [RADIUS] Access-Request(1) User=m.garcia NAS-Port=0",
        "en": "WiFi_AP -> AAA:1812 [RADIUS] Access-Request User=m.garcia"
      },
      "fact": {
        "es": "Centraliza AAA (Autenticación, Autorización y Contabilidad) cuando un punto de acceso Wi-Fi Enterprise, VPN o switch consulta si un usuario puede entrar.",
        "en": "Centralizes AAA (Authentication, Authorization, Accounting) between Wi-Fi access points, VPN gateways, switches, and a central identity backend."
      }
    },
    {
      "id": "wireguard",
      "name": "WireGuard",
      "fullName": {
        "es": "Túnel VPN moderno de estado mínimo en espacio kernel",
        "en": "Modern Kernel-Space Cryptographic VPN Tunnel"
      },
      "category": "security-infra",
      "osi": 3,
      "osiLabel": { "es": "Capa 3/4 · Túnel VPN UDP", "en": "Layer 3/4 · UDP VPN Tunnel" },
      "transport": { "es": "UDP (Noise_IK + ChaCha20)", "en": "UDP (Noise + ChaCha20)" },
      "port": "UDP 51820",
      "portShort": ":51820",
      "portAliases": ["51820", "udp 51820", "puerto 51820"],
      "security": "secure",
      "securityLabel": { "es": "ChaCha20-Poly1305 / Curve25519", "en": "ChaCha20 / Curve25519" },
      "rfc": "Noise Protocol Framework",
      "pop": true,
      "aka": ["WireGuard", "WG"],
      "wiki": "WireGuard",
      "nodes": {
        "a": { "es": "Peer Móvil", "en": "Mobile Peer" },
        "b": { "es": "Peer Gateway", "en": "Gateway Peer" }
      },
      "flow": [
        { "dir": "ab", "es": "Handshake Initiation Noise_IK de 1 RTT con clave pública estática", "en": "1-RTT Noise_IK Handshake Initiation" },
        { "dir": "ba", "es": "Handshake Response · Cryptokey Routing (AllowedIPs)", "en": "Handshake Response · Cryptokey Routing" },
        { "dir": "bi", "es": "Paquetes IP encapsulados cifrados en silencio ante no autorizados", "en": "Encrypted IP payload · silent drop to strangers" }
      ],
      "trace": {
        "es": "Peer:49102 -> VPN:51820 [WireGuard] Type: Transport Data Key idx=0x4a",
        "en": "Peer -> VPN:51820 [WireGuard] Transport Data Receiver=0x4a"
      },
      "fact": {
        "es": "Con apenas ~4.000 líneas de código en el kernel Linux, ofrece roaming instantáneo por UDP 51820 y ni siquiera responde a escaneos sin clave pública válida.",
        "en": "Sleek ~4,000-line kernel VPN using Curve25519 + ChaCha20-Poly1305 over UDP 51820; silently ignores unauthorized probes and roams seamlessly across IPs."
      }
    },

    {
      "id": "tcp",
      "name": "TCP",
      "fullName": {
        "es": "Protocolo de Control de Transmisión (orientado a conexión)",
        "en": "Transmission Control Protocol (reliable stream)"
      },
      "category": "transport-routing",
      "osi": 4,
      "osiLabel": { "es": "Capa 4 · Transporte Fiable", "en": "Layer 4 · Reliable Transport" },
      "transport": { "es": "Protocolo IP 6 · Orientado a flujo", "en": "IP Proto 6 · Byte Stream" },
      "port": "Capa 4 · Proto IP 6",
      "portShort": "L4 · Proto 6",
      "portAliases": ["capa 4", "layer 4", "l4", "proto 6", "ip 6", "6", "protocolo 6"],
      "security": "control",
      "securityLabel": { "es": "Entrega ordenada + retransmisión", "en": "Ordered delivery + retransmit" },
      "rfc": "RFC 9293",
      "pop": true,
      "aka": ["TCP", "Transmission Control Protocol"],
      "wiki": "Transmission_Control_Protocol",
      "nodes": {
        "a": { "es": "Emisor", "en": "Sender" },
        "b": { "es": "Receptor", "en": "Receiver" }
      },
      "flow": [
        { "dir": "ab", "es": "SYN (ISN=x) -> SYN-ACK (ACK=x+1) -> ACK (3-Way Handshake)", "en": "SYN -> SYN-ACK -> ACK (3-Way Handshake)" },
        { "dir": "bi", "es": "Control de congestión + ventana deslizante + SACK", "en": "Congestion control, sliding window & SACK" },
        { "dir": "bi", "es": "Cierre limpio ordenado con flags FIN / ACK o RST", "en": "Graceful teardown via FIN / ACK or abrupt RST" }
      ],
      "trace": {
        "es": "10.0.0.5:51200 -> 93.184.216.34:443 [TCP] [SYN] Seq=0 Win=64240 MSS=1460",
        "en": "10.0.0.5:51200 -> 93.184.216.34:443 [TCP] [SYN] Seq=0 Win=64240"
      },
      "fact": {
        "es": "Garantiza flujo continuo de bytes sin pérdidas ni desorden mediante acuses de recibo (ACK), control de flujo y detección de congestión sobre el protocolo IP 6.",
        "en": "Turns best-effort IP packets (IP protocol 6) into a reliable, ordered byte stream via 3-way handshakes, sequence numbers, ACKs, and congestion windows."
      }
    },
    {
      "id": "udp",
      "name": "UDP",
      "fullName": {
        "es": "Protocolo de Datagramas de Usuario (sin conexión)",
        "en": "User Datagram Protocol (connectionless)"
      },
      "category": "transport-routing",
      "osi": 4,
      "osiLabel": { "es": "Capa 4 · Transporte Ligero", "en": "Layer 4 · Stateless Datagram" },
      "transport": { "es": "Protocolo IP 17 · Datagramas", "en": "IP Proto 17 · Datagrams" },
      "port": "Capa 4 · Proto IP 17",
      "portShort": "L4 · Proto 17",
      "portAliases": ["capa 4", "layer 4", "l4", "proto 17", "ip 17", "17", "protocolo 17"],
      "security": "control",
      "securityLabel": { "es": "Cabecera 8 B sin handshake", "en": "8-byte header · no handshake" },
      "rfc": "RFC 768",
      "pop": true,
      "aka": ["UDP", "User Datagram Protocol"],
      "wiki": "User_Datagram_Protocol",
      "nodes": {
        "a": { "es": "Origen", "en": "Source" },
        "b": { "es": "Destino", "en": "Destination" }
      },
      "flow": [
        { "dir": "ab", "es": "Sin handshake: cabecera mínima de 8 bytes (puertos, len, cksum)", "en": "Zero handshake: 8-byte header (ports, length, cksum)" },
        { "dir": "ab", "es": "Envío inmediato 'fire-and-forget' sin bloqueo ante pérdida", "en": "Immediate fire-and-forget delivery without stalls" },
        { "dir": "ba", "es": "Base de DNS, DHCP, VoIP, gaming, WireGuard y QUIC", "en": "Base for DNS, DHCP, VoIP, gaming, WireGuard & QUIC" }
      ],
      "trace": {
        "es": "Host:54112 -> DNS:53 [UDP] Len=34 Header=8B (SrcPort, DstPort, Len, Cksum)",
        "en": "Host:54112 -> DNS:53 [UDP] Len=34 Header=8 bytes"
      },
      "fact": {
        "es": "Cabecera diminuta de 8 bytes frente a los 20+ de TCP: ideal cuando la velocidad y latencia importan más que retransmitir paquetes viejos (o si la app maneja su propia fiabilidad como QUIC).",
        "en": "Minimal 8-byte transport header (IP protocol 17) skipping handshakes and retransmissions—ideal for DNS, real-time media, games, and QUIC."
      }
    },
    {
      "id": "sctp",
      "name": "SCTP",
      "fullName": {
        "es": "Protocolo de Transmisión de Control de Flujo (Multi-Homing)",
        "en": "Stream Control Transmission Protocol"
      },
      "category": "transport-routing",
      "osi": 4,
      "osiLabel": { "es": "Capa 4 · Transporte Multi-Stream", "en": "Layer 4 · Multi-Stream Transport" },
      "transport": { "es": "Protocolo IP 132 · Mensajes", "en": "IP Proto 132 · Multi-Homed" },
      "port": "Capa 4 · Proto IP 132",
      "portShort": "L4 · Proto 132",
      "portAliases": ["capa 4", "layer 4", "l4", "proto 132", "ip 132", "132"],
      "security": "control",
      "securityLabel": { "es": "4-Way Handshake con Cookie", "en": "4-Way Anti-SYN-Flood Cookie" },
      "rfc": "RFC 9260",
      "pop": false,
      "aka": ["SCTP", "Stream Control Transmission Protocol"],
      "wiki": "Stream_Control_Transmission_Protocol",
      "nodes": {
        "a": { "es": "Core 5G / WebRTC", "en": "5G Core / WebRTC" },
        "b": { "es": "Peer Multi-IP", "en": "Multi-Homed Peer" }
      },
      "flow": [
        { "dir": "bi", "es": "INIT -> INIT-ACK (State Cookie) -> COOKIE-ECHO -> COOKIE-ACK", "en": "4-Way INIT / Cookie-Echo handshake" },
        { "dir": "bi", "es": "Múltiples streams paralelos preservando límites de mensaje", "en": "Multiple parallel message-framed streams" },
        { "dir": "bi", "es": "Failover automático entre dos tarjetas de red / IPs", "en": "Built-in multi-homing path failover" }
      ],
      "trace": {
        "es": "MME -> eNB [SCTP] SACK + DATA Chunk Stream=1 SSN=42 Proto=S1AP",
        "en": "Core -> Node [SCTP] DATA Chunk Stream=1 SSN=42"
      },
      "fact": {
        "es": "Reúne lo mejor de TCP y UDP más tolerancia a fallos multi-IP: usado en señalización de telefonía 4G/5G y como transporte del DataChannel de WebRTC.",
        "en": "Combines TCP reliability, UDP message framing, parallel streams, and multi-homed IP failover; standard in 4G/5G telecom signaling and WebRTC DataChannels."
      }
    },
    {
      "id": "ipv4",
      "name": "IPv4",
      "fullName": {
        "es": "Protocolo de Internet versión 4 (direcciones 32 bits)",
        "en": "Internet Protocol version 4 (32-bit)"
      },
      "category": "transport-routing",
      "osi": 3,
      "osiLabel": { "es": "Capa 3 · Red (32 bits)", "en": "Layer 3 · Network (32-bit)" },
      "transport": { "es": "EtherType 0x0800", "en": "EtherType 0x0800" },
      "port": "Capa 3 · EtherType 0x0800",
      "portShort": "L3 · 0x0800",
      "portAliases": ["capa 3", "layer 3", "l3", "0x0800", "32 bits", "ipv4"],
      "security": "control",
      "securityLabel": { "es": "4.29 mil millones de IPs + NAT", "en": "4.29B addresses + NAT" },
      "rfc": "RFC 791",
      "pop": true,
      "aka": ["IPv4", "IP v4", "Internet Protocol v4"],
      "wiki": "Internet_Protocol_version_4",
      "nodes": {
        "a": { "es": "Host 192.168.1.10", "en": "Host 192.168.1.10" },
        "b": { "es": "Router / Salto", "en": "Router Hop" }
      },
      "flow": [
        { "dir": "ab", "es": "Cabecera mínima 20 B · Origen/Destino decimal con puntos", "en": "20-byte header · dotted-quad Src & Dst IP" },
        { "dir": "bi", "es": "TTL decrece en 1 por cada router para evitar bucles", "en": "TTL decremented by 1 per router hop" },
        { "dir": "ba", "es": "Fragmentación posible en ruta si supera MTU", "en": "Supports in-path fragmentation when > MTU" }
      ],
      "trace": {
        "es": "IPv4 Src: 192.168.1.10 -> Dst: 8.8.8.8, TTL: 64, Proto: UDP (17), Len: 62",
        "en": "IPv4 Src: 192.168.1.10 -> Dst: 8.8.8.8 TTL=64 Proto=17"
      },
      "fact": {
        "es": "Direcciones de 32 bits (ej. `192.0.2.10`). Su agotamiento forzó el uso masivo de subredes RFC 1918 (`10.x`, `172.16.x`, `192.168.x`) detrás de traducción NAT.",
        "en": "32-bit addressing (`a.b.c.d`); address exhaustion led to widespread RFC 1918 private networks behind NAT and CGNAT translators."
      }
    },
    {
      "id": "ipv6",
      "name": "IPv6",
      "fullName": {
        "es": "Protocolo de Internet versión 6 (128 bits)",
        "en": "Internet Protocol version 6 (128-bit)"
      },
      "category": "transport-routing",
      "osi": 3,
      "osiLabel": { "es": "Capa 3 · Red (128 bits)", "en": "Layer 3 · Network (128-bit)" },
      "transport": { "es": "EtherType 0x86DD", "en": "EtherType 0x86DD" },
      "port": "Capa 3 · EtherType 0x86DD",
      "portShort": "L3 · 0x86DD",
      "portAliases": ["capa 3", "layer 3", "l3", "0x86dd", "128 bits", "ipv6"],
      "security": "control",
      "securityLabel": { "es": "Cabecera fija 40 B · SLAAC / NDP", "en": "Fixed 40B header · SLAAC" },
      "rfc": "RFC 8200",
      "pop": true,
      "aka": ["IPv6", "IP v6", "Internet Protocol v6"],
      "wiki": "IPv6",
      "nodes": {
        "a": { "es": "Host fe80::1a", "en": "Host fe80::1a" },
        "b": { "es": "Router RA", "en": "RA Router" }
      },
      "flow": [
        { "dir": "ba", "es": "Router Advertisement ICMPv6 + prefijo /64 -> SLAAC", "en": "ICMPv6 Router Advertisement /64 -> SLAAC auto-config" },
        { "dir": "ab", "es": "Cabecera fija simplificada de 40 B (Next Header + Hop Limit)", "en": "Streamlined fixed 40B header (Next Header + Hop Limit)" },
        { "dir": "bi", "es": "Elimina necesidad de NAT y prohíbe fragmentación en routers", "en": "No NAT needed · routers never fragment packets" }
      ],
      "trace": {
        "es": "IPv6 Src: 2001:db8::1 -> Dst: 2606:4700:4700::1111 HopLimit=64",
        "en": "IPv6 Src: 2001:db8::1 -> Dst: 2606:4700::1111 HopLimit=64"
      },
      "fact": {
        "es": "Ofrece 2^128 direcciones hexadecimales (8 grupos separados por `:`), autoconfiguración SLAAC sin DHCPv6 y reemplazo de ARP por Neighbor Discovery (ICMPv6).",
        "en": "128-bit hexadecimal addressing (`2001:db8::/32`), simplified fixed 40-byte header for fast routing, SLAAC auto-configuration, and Neighbor Discovery instead of ARP."
      }
    },
    {
      "id": "icmp",
      "name": "ICMP",
      "fullName": {
        "es": "Protocolo de Mensajes de Control de Internet (Ping/Traceroute)",
        "en": "Internet Control Message Protocol"
      },
      "category": "transport-routing",
      "osi": 3,
      "osiLabel": { "es": "Capa 3 · Control y Diagnóstico", "en": "Layer 3 · Diagnostics & Errors" },
      "transport": { "es": "Protocolo IP 1 (v4) / 58 (v6)", "en": "IP Proto 1 (v4) / 58 (v6)" },
      "port": "Capa 3 · Proto IP 1 / 58",
      "portShort": "L3 · Proto 1",
      "portAliases": ["capa 3", "layer 3", "l3", "proto 1", "proto 58", "ip 1", "1"],
      "security": "control",
      "securityLabel": { "es": "Sin puertos · Tipo y Código", "en": "No ports · Type & Code" },
      "rfc": "RFC 792 / RFC 4443",
      "pop": true,
      "aka": ["ICMP", "ICMPv6", "Ping", "Internet Control Message Protocol"],
      "wiki": "Internet_Control_Message_Protocol",
      "nodes": {
        "a": { "es": "Herramienta Ping", "en": "Ping / Trace" },
        "b": { "es": "Router / Host", "en": "Router / Host" }
      },
      "flow": [
        { "dir": "ab", "es": "Type 8 Code 0: Echo Request (TTL=1 en traceroute)", "en": "Type 8 Code 0: Echo Request" },
        { "dir": "ba", "es": "Type 11: Time Exceeded (salto intermedio) o Type 3 Unreachable", "en": "Type 11: Time Exceeded or Type 3 Unreachable" },
        { "dir": "ba", "es": "Type 0 Code 0: Echo Reply · rtt = 14.2 ms", "en": "Type 0 Code 0: Echo Reply · rtt = 14.2 ms" }
      ],
      "trace": {
        "es": "192.168.1.5 -> 1.1.1.1 [ICMP] Echo (ping) request id=0x0412 seq=1 ttl=64",
        "en": "Host -> 1.1.1.1 [ICMP] Type=8 Echo Request seq=1 ttl=64"
      },
      "fact": {
        "es": "No usa puertos ni transporta datos de usuario: reporta errores de red (Destino Inalcanzable, TTL Excedido) y hace posibles `ping` y `traceroute`.",
        "en": "Layer-3 control companion with no port numbers: powers `ping`, `traceroute` (via TTL Exceeded), and Path MTU Discovery."
      }
    },
    {
      "id": "ipsec",
      "name": "IPsec (IKEv2 / ESP)",
      "fullName": {
        "es": "Seguridad a Nivel de Paquete IP (VPN Sitio a Sitio)",
        "en": "Internet Protocol Security (Site-to-Site VPN)"
      },
      "category": "transport-routing",
      "osi": 3,
      "osiLabel": { "es": "Capa 3 · Cifrado IP / VPN", "en": "Layer 3 · IP Encryption" },
      "transport": { "es": "ESP Proto 50 + IKE UDP 500/4500", "en": "ESP Proto 50 + UDP 500/4500" },
      "port": "Capa 3 · ESP 50 / UDP 500·4500",
      "portShort": "ESP 50 / :500",
      "portAliases": ["500", "4500", "50", "500 4500", "capa 3", "layer 3", "esp 50"],
      "security": "secure",
      "securityLabel": { "es": "Cifrado y firma L3 transparente", "en": "Transparent L3 encryption" },
      "rfc": "RFC 4301 / RFC 4303 / RFC 7296",
      "pop": false,
      "aka": ["IPsec", "IKEv2", "ESP"],
      "wiki": "IPsec",
      "nodes": {
        "a": { "es": "Gateway Sede A", "en": "HQ Gateway" },
        "b": { "es": "Gateway Nube", "en": "Cloud Gateway" }
      },
      "flow": [
        { "dir": "bi", "es": "IKEv2 SA_INIT + AUTH (UDP 500, o 4500 con NAT-Traversal)", "en": "IKEv2 SA_INIT + AUTH (UDP 500 / 4500 NAT-T)" },
        { "dir": "bi", "es": "Acuerda Security Associations (SA) bidireccionales", "en": "Establishes bidirectional Security Associations (SA)" },
        { "dir": "bi", "es": "Modo Túnel ESP encapsula y cifra paquetes IP enteros", "en": "ESP Tunnel mode encrypts & authenticates whole IP packets" }
      ],
      "trace": {
        "es": "GW_A -> GW_B [ESP] SPI=0x82fa1009 Seq=412 (payload TCP interno cifrado)",
        "en": "GW_A -> GW_B [ESP] SPI=0x82fa1009 Encrypted Tunnel Packet"
      },
      "fact": {
        "es": "Cifra en capa 3 de forma transparente para todas las aplicaciones superiores; estándar clásico en enlaces VPN site-to-site entre oficinas y nubes AWS/GCP/Azure.",
        "en": "Protects entire IP packets at Layer 3 transparently to upper apps; classic enterprise standard for site-to-site router and cloud VPN tunnels."
      }
    },
    {
      "id": "bgp",
      "name": "BGP",
      "fullName": {
        "es": "Protocolo de Puerta de Enlace de Frontera (Sistemas Autónomos)",
        "en": "Border Gateway Protocol (Autonomous Systems)"
      },
      "category": "transport-routing",
      "osi": 7,
      "osiLabel": { "es": "Capa 4/7 · Routing Internet AS", "en": "Layer 4/7 · Internet Routing" },
      "transport": { "es": "TCP (sesiones eBGP / iBGP)", "en": "TCP (eBGP / iBGP)" },
      "port": "TCP 179",
      "portShort": "TCP :179",
      "portAliases": ["179", "tcp 179", "puerto 179"],
      "security": "control",
      "securityLabel": { "es": "Path-Vector + RPKI", "en": "Path-Vector + RPKI" },
      "rfc": "RFC 4271",
      "pop": true,
      "aka": ["BGP", "BGP-4", "Border Gateway Protocol", "eBGP", "iBGP"],
      "wiki": "Border_Gateway_Protocol",
      "nodes": {
        "a": { "es": "AS 65100 (ISP A)", "en": "AS 65100 (ISP A)" },
        "b": { "es": "AS 13335 (Peer B)", "en": "AS 13335 (Peer B)" }
      },
      "flow": [
        { "dir": "bi", "es": "OPEN sobre TCP 179 intercambiando número de Sistema Autónomo", "en": "TCP 179 OPEN exchanging Autonomous System numbers" },
        { "dir": "ab", "es": "UPDATE anuncia prefijo CIDR + AS_PATH + Next-Hop + MED", "en": "UPDATE announces CIDR prefix + AS_PATH + Next-Hop" },
        { "dir": "bi", "es": "KEEPALIVE periódico y WITHDRAW si cae una ruta", "en": "Periodic KEEPALIVE & route WITHDRAW on failure" }
      ],
      "trace": {
        "es": "ISP_A:179 -> Peer_B [BGP] UPDATE Path Attributes: AS_PATH 65100 174 13335",
        "en": "ISP_A:179 -> Peer_B [BGP] UPDATE 198.51.100.0/24 AS_PATH"
      },
      "fact": {
        "es": "El protocolo que mantiene pegado a Internet: intercambia prefijos IP entre miles de Sistemas Autónomos (ISP, nubes, IXP) evaluando políticas y vector de ruta AS_PATH.",
        "en": "The routing glue of the global Internet: exchanges reachability prefixes and AS_PATH policies between Autonomous Systems over TCP 179."
      }
    },
    {
      "id": "ospf",
      "name": "OSPF",
      "fullName": {
        "es": "Abrir el Camino Más Corto Primero (Estado de Enlace IGP)",
        "en": "Open Shortest Path First (Link-State IGP)"
      },
      "category": "transport-routing",
      "osi": 3,
      "osiLabel": { "es": "Capa 3 · Routing Interno IGP", "en": "Layer 3 · Interior Routing" },
      "transport": { "es": "Protocolo IP 89 (Multicast)", "en": "IP Proto 89 (224.0.0.5)" },
      "port": "Capa 3 · Proto IP 89",
      "portShort": "L3 · Proto 89",
      "portAliases": ["capa 3", "layer 3", "l3", "proto 89", "ip 89", "89"],
      "security": "control",
      "securityLabel": { "es": "Algoritmo Dijkstra SPF · Áreas", "en": "Dijkstra SPF · Areas" },
      "rfc": "RFC 2328 (v2) / RFC 5340 (v3)",
      "pop": false,
      "aka": ["OSPF", "OSPFv2", "OSPFv3", "Open Shortest Path First"],
      "wiki": "Open_Shortest_Path_First",
      "nodes": {
        "a": { "es": "Router Área 0", "en": "Area 0 Router" },
        "b": { "es": "Vecino DR/BDR", "en": "Neighbor DR/BDR" }
      },
      "flow": [
        { "dir": "bi", "es": "Hello a 224.0.0.5 para descubrir vecinos y elegir DR/BDR", "en": "Hello multicast 224.0.0.5 -> Full Adjacency" },
        { "dir": "bi", "es": "Inundación de LSAs (Link-State Advertisements) -> LSDB común", "en": "Flood LSAs (Link-State) -> identical topology LSDB" },
        { "dir": "ab", "es": "Cada router ejecuta algoritmo Dijkstra por costo de ancho de banda", "en": "Runs Dijkstra SPF using interface bandwidth cost" }
      ],
      "trace": {
        "es": "R1 -> 224.0.0.5 [OSPF] Hello Packet Area=0.0.0.0 RouterID=10.255.0.1",
        "en": "R1 -> 224.0.0.5 [OSPF] LS Update Area 0.0.0.0 Proto=89"
      },
      "fact": {
        "es": "IGP de estado de enlace para redes empresariales y backbones internos: todos los routers de un área conocen el mapa completo y eligen la ruta con menor costo (Dijkstra).",
        "en": "Dominant enterprise interior routing protocol (IP proto 89): neighbors share Link-State maps and run Dijkstra SPF by bandwidth cost."
      }
    },
    {
      "id": "arp",
      "name": "ARP",
      "fullName": {
        "es": "Protocolo de Resolución de Direcciones (IP a MAC)",
        "en": "Address Resolution Protocol (IP to MAC)"
      },
      "category": "transport-routing",
      "osi": 2,
      "osiLabel": { "es": "Capa 2/3 · IPv4 -> MAC", "en": "Layer 2/3 · IPv4 -> MAC" },
      "transport": { "es": "Trama Ethernet 0x0806", "en": "Ethernet EtherType 0x0806" },
      "port": "Capa 2 · EtherType 0x0806",
      "portShort": "L2 · 0x0806",
      "portAliases": ["capa 2", "layer 2", "l2", "0x0806", "arp"],
      "security": "plain",
      "securityLabel": { "es": "Broadcast LAN sin autenticación", "en": "Unauthenticated LAN broadcast" },
      "rfc": "RFC 826",
      "pop": true,
      "aka": ["ARP", "Address Resolution Protocol"],
      "wiki": "Address_Resolution_Protocol",
      "nodes": {
        "a": { "es": "Host A", "en": "Host A" },
        "b": { "es": "Broadcast ff:ff / Host B", "en": "Broadcast ff:ff / Host B" }
      },
      "flow": [
        { "dir": "ab", "es": "Broadcast ff:ff:ff:ff:ff:ff: Who has 192.168.1.1? Tell 1.25", "en": "Broadcast Who has 192.168.1.1? Tell 192.168.1.25" },
        { "dir": "ba", "es": "Unicast Reply: 192.168.1.1 is at a4:2b:8c:10:f1:02", "en": "Unicast Reply: 192.168.1.1 is at a4:2b:8c:10:f1:02" },
        { "dir": "bi", "es": "Se guarda la pareja IP-MAC temporalmente en la caché local", "en": "Caches IP-to-MAC mapping locally for LAN frames" }
      ],
      "trace": {
        "es": "a4:.. -> Broadcast [ARP] Who has 192.168.1.1? Tell 192.168.1.25",
        "en": "HostA -> ff:ff:ff:ff:ff:ff [ARP] Who has 192.168.1.1?"
      },
      "fact": {
        "es": "Puente indispensable en LAN IPv4: traduce una IP local conocida a la dirección física MAC de 48 bits necesaria para enviar la trama Ethernet.",
        "en": "Local LAN bridge translating a known IPv4 address into a 48-bit Ethernet MAC hardware address via broadcast Who-Has / Is-At exchanges."
      }
    },
    {
      "id": "vlan-8021q",
      "name": "IEEE 802.1Q (VLAN Tag)",
      "fullName": {
        "es": "Etiquetado de Redes Virtuales VLAN en Tramas Ethernet",
        "en": "IEEE 802.1Q Virtual LAN Tagging"
      },
      "category": "transport-routing",
      "osi": 2,
      "osiLabel": { "es": "Capa 2 · Segmentación VLAN", "en": "Layer 2 · VLAN Tagging" },
      "transport": { "es": "Ethernet TPID 0x8100 (+4 B)", "en": "Ethernet TPID 0x8100 (+4B)" },
      "port": "Capa 2 · TPID 0x8100",
      "portShort": "L2 · 0x8100",
      "portAliases": ["capa 2", "layer 2", "l2", "0x8100", "802.1q", "vlan"],
      "security": "control",
      "securityLabel": { "es": "Aísla dominios broadcast L2", "en": "Isolates L2 broadcast domains" },
      "rfc": "IEEE 802.1Q",
      "pop": false,
      "aka": ["802.1Q", "IEEE 802.1Q", "VLAN", "VLAN Tag"],
      "wiki": "IEEE_802.1Q",
      "nodes": {
        "a": { "es": "Switch A (Trunk)", "en": "Switch A (Trunk)" },
        "b": { "es": "Switch B (Trunk)", "en": "Switch B (Trunk)" }
      },
      "flow": [
        { "dir": "ab", "es": "Inserta etiqueta de 4 bytes en trama Ethernet (TPID 0x8100)", "en": "Inserts 4-byte 0x8100 tag into Ethernet header" },
        { "dir": "bi", "es": "12 bits VID (1..4094) + 3 bits PCP de prioridad QoS", "en": "12-bit VID (1..4094) + 3-bit QoS priority" },
        { "dir": "ba", "es": "Switch destino separa tráfico Voz / Gestión / Invitados", "en": "Receiving switch separates Voice / Mgmt / Guest traffic" }
      ],
      "trace": {
        "es": "Eth Src->Dst [802.1Q] TPID: 0x8100 PRI: 5 VID: 20 (VLAN_VoIP) IPv4",
        "en": "Eth [802.1Q Virtual LAN] PRI: 5 ID: 20 TPID: 0x8100"
      },
      "fact": {
        "es": "Permite transportar decenas de subredes aisladas por un único cable troncal entre switches o hacia un hipervisor insertando 4 bytes (`VID 1–4094`).",
        "en": "Multiplexes isolated Layer-2 virtual LANs (VID 1–4094) across a single trunk link by inserting a 4-byte `0x8100` header into Ethernet frames."
      }
    },
    {
      "id": "stp-8021d",
      "name": "STP / RSTP (IEEE 802.1D)",
      "fullName": {
        "es": "Protocolo Árbol de Expansión (prevención de bucles L2)",
        "en": "Spanning Tree Protocol (L2 Loop Prevention)"
      },
      "category": "transport-routing",
      "osi": 2,
      "osiLabel": { "es": "Capa 2 · Topología sin Bucles", "en": "Layer 2 · Loop Prevention" },
      "transport": { "es": "Tramas BPDU Multicast L2", "en": "L2 Multicast BPDUs" },
      "port": "Capa 2 · BPDU (LLC 0x42)",
      "portShort": "L2 · BPDU",
      "portAliases": ["capa 2", "layer 2", "l2", "bpdu", "0x42", "802.1d", "802.1w"],
      "security": "control",
      "securityLabel": { "es": "Bloquea enlaces redundantes", "en": "Blocks redundant L2 loops" },
      "rfc": "IEEE 802.1D / 802.1w (RSTP)",
      "pop": false,
      "aka": ["STP", "RSTP", "Spanning Tree", "Spanning Tree Protocol", "802.1D", "802.1w"],
      "wiki": "Spanning_Tree_Protocol",
      "nodes": {
        "a": { "es": "Root Bridge", "en": "Root Bridge" },
        "b": { "es": "Switch Acceso", "en": "Access Switch" }
      },
      "flow": [
        { "dir": "bi", "es": "Intercambio BPDU -> elige Root Bridge (menor Bridge ID)", "en": "Exchanges BPDUs -> elects lowest Bridge ID Root" },
        { "dir": "ab", "es": "Calcula ruta raíz por costo y coloca puertos sobrantes en BLOCKING", "en": "Computes root path cost & blocks redundant ports" },
        { "dir": "ba", "es": "Si falla el enlace principal, RSTP converge en < 1 segundo", "en": "Rapid failover converges backup port in < 1 sec" }
      ],
      "trace": {
        "es": "SwRoot -> 01:80:c2:00:00:00 [RSTP] BPDU Root=32768/mac Cost=4",
        "en": "RootSw -> 01:80:c2:00:00:00 [STP/RSTP] Conf BPDU Cost=4"
      },
      "fact": {
        "es": "Evita tormentas de broadcast mortales cuando conectas cables redundantes entre switches: bloquea lógicamente un camino y solo lo abre si el otro cae.",
        "en": "Prevents catastrophic Layer-2 broadcast storms across redundant switch links by logically blocking backup ports until an active link fails."
      }
    }
  ]
};
