import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:halplast/misPedidosTerminados.dart';
import 'package:halplast/main.dart';
import 'package:halplast/detallePedido.dart';
import 'package:halplast/pqrs.dart';
import 'package:halplast/chat.dart' as chat;
import 'package:intl/intl.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class PaginaPedidos extends StatefulWidget {
  final String correo;
  final String nombre;
  final String id;

  PaginaPedidos({required this.correo, required this.nombre, required this.id});

  @override
  _PaginaPedidosState createState() => _PaginaPedidosState();
}

class _PaginaPedidosState extends State<PaginaPedidos> {
  List<Pedido> _orders = [];
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late bool isChatActive = false;

  @override
  void initState() {
    super.initState();
    _fetchPedidos();
    _verificarEstadoChat();
  }

  Future<void> _fetchPedidos() async {
    try {
      final uri = Uri.parse('https://apihalplast.onrender.com/api/envios/${widget.correo}');
      final response = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      if (response.statusCode == 200) {
        final decodedResponse = json.decode(response.body);
        if (decodedResponse is Map<String, dynamic> && decodedResponse.containsKey('locacionesPorEnvio')) {
          final List<dynamic>? data = decodedResponse['locacionesPorEnvio'];

          if (data != null && data.isNotEmpty) {
            try {
              final orders = data.map((item) {
                return Pedido.fromJson(item);
              }).toList();

              setState(() {
                _orders = orders;
                if (_orders.isNotEmpty) {
                  _orders[0].isExpanded = true;
                }
              });
            } catch (e) {
              _showErrorSnackBar('Error al procesar los datos.');
            }
          } else {
            _showErrorSnackBar('No se encontraron locaciones para los envíos.');
          }
        } else {
          _showErrorSnackBar('Estructura inesperada en la respuesta del servidor.');
        }
      } else {
        _showErrorSnackBar('Error al cargar los pedidos: Código ${response.statusCode}');
      }
    } catch (error) {
      _showErrorSnackBar('Error de conexión: $error');
    }
  }

  Future<void> _verificarEstadoChat() async {
    try {
      final response1 = await http.get(Uri.parse('https://apihalplast.onrender.com/api/chatPqrs/unico/${widget.id}'));
      if (response1.statusCode == 200) {
        final Map<String, dynamic> chatInfo1 = jsonDecode(response1.body);
        String ChatId = chatInfo1['_id'];
        final response = await http.get(
          Uri.parse('https://apihalplast.onrender.com/api/chatPqrs/estado/$ChatId'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          },
        );

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          if (data['estado'] == "Activo") {
            setState(() {
              isChatActive = true;
            });
          }
        }
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  void _showErrorSnackBar(String message) => ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(message)),
  );

  void _loadChatInfo() async {
    try {
      final response = await http.get(Uri.parse('https://apihalplast.onrender.com/api/chatPqrs/unico/${widget.id}'));
      if (response.statusCode == 200) {
        String OtroUsuario;
        final Map<String, dynamic> chatInfo = jsonDecode(response.body);
        String sistemaChatId = chatInfo['_id'];
        if (widget.correo != chatInfo['cliente']) {
          OtroUsuario = chatInfo['cliente'];
        } else {
          OtroUsuario = chatInfo['empleado'];
        }
        final response2 = await http.get(Uri.parse('https://apihalplast.onrender.com/api/usuario/rol/${widget.correo}'));
        if (response2.statusCode == 200) {
          final Map<String, dynamic> RolInfo = jsonDecode(response2.body);
          String RolUsuario = RolInfo['rol'];
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => chat.ChatScreen(sistemaChatId: sistemaChatId, userId: widget.correo, userRol: RolUsuario, OtroUsuario: OtroUsuario)),
          );
        }
      } else {
        throw Exception('Fallo cargando informacion del chat');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  void notificacionCerrarSesion(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.lightBlue[50],
          child: WillPopScope(
            onWillPop: () async => false,
            child: Container(
              padding: EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 20.0),
                  Text(
                    'Cerrando sesión...',
                    style: TextStyle(fontSize: 16.0),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );

    Future.delayed(Duration(seconds: 2), () {
      Navigator.of(context, rootNavigator: true).pop();
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => MyApp()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text('Halplast'),
        leading: Builder(
          builder: (BuildContext context) {
            return IconButton(
              icon: Icon(Icons.menu),
              onPressed: () {
                Scaffold.of(context).openDrawer();
              },
            );
          },
        ),
        backgroundColor: Color.fromARGB(255, 186, 224, 233),
        actions: [
          IconButton(
            icon: Icon(Icons.person),
            onPressed: () {
              _scaffoldKey.currentState?.openEndDrawer();
            },
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              decoration: BoxDecoration(
                color: Color.fromARGB(255, 186, 224, 233),
              ),
              child: Text(
                'Menu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.align_horizontal_left_rounded),
              title: Text('Opciones de pedido'),
            ),
            SizedBox(height: 20),
            ListTile(
              leading: Icon(Icons.list),
              title: Text('Mis pedidos actuales'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => PaginaPedidos(correo: widget.correo, nombre: widget.nombre, id: widget.id)),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.history),
              title: Text('Historial de pedidos'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => PaginaPedidosTerminados(correo: widget.correo, nombre: widget.nombre, id: widget.id)),
                );
              },
            ),
            if (isChatActive)
              ListTile(
                leading: Icon(Icons.chat),
                title: Text('Chat'), 
                onTap: _loadChatInfo,
            ),
            SizedBox(height: 190),
            ListTile(
              leading: Icon(Icons.exit_to_app),
              title: Text('Cerrar sesión'),
              onTap: () {
                notificacionCerrarSesion(context);
              },
            ),
          ],
        ),
      ),
      endDrawer: Drawer(
        child: Container(
          color: Colors.white,
          child: Column(
            children: [
              Container(
                width: 100,
                height: 100,
                margin: const EdgeInsets.all(50),
                child: Image.network(
                  "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
                ),
              ),
              Text(
                widget.nombre,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25),
              ),
              SizedBox(height: 20),
              Text(
                widget.correo,
                style: TextStyle(fontSize: 18, color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
      body: _orders.isEmpty
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: ExpansionPanelList(
                    expansionCallback: (int index, bool isExpanded) {
                      setState(() {
                        _orders[index].isExpanded = !(_orders[index].isExpanded);
                      });
                    },
                    children: _orders.asMap().entries.map<ExpansionPanel>((entry) {
                      Pedido pedido = entry.value;
                      int index = entry.key;
                      return ExpansionPanel(
                        headerBuilder: (BuildContext context, bool isExpanded) {
                          return ListTile(
                            title: Text('Pedido ${index + 1} estado ${pedido.status}'),
                          );
                        },
                        body: Column(
                          children: [
                          Card(
                            elevation: 2.0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10.0),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Text('Precio total: \$${pedido.total}', style: TextStyle(fontSize: 16)),
                                  SizedBox(height: 8),
                                  Text('Estado Pedido: ${pedido.status}', style: TextStyle(fontSize: 16)),
                                  SizedBox(height: 8),
                                  Text('Fecha entrega: ${pedido.fechaEntrega}', style: TextStyle(fontSize: 16)),
                                  SizedBox(height: 8),
                                  Text('Dirección de entrega: ${pedido.direccionEntrega}', style: TextStyle(fontSize: 16)),
                                  SizedBox(height: 8),
                                  ExpansionTile(
                                    title: Text('Opciones Extra', style: TextStyle(fontSize: 16)),
                                    children: [
                                      ListTile(
                                        title: Text('Detalles del pedido', style: TextStyle(fontSize: 16)),
                                        trailing: Icon(Icons.arrow_right, color: Colors.grey),
                                        onTap: () {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) => PaginaDetallePedidos(pedidoId: pedido.id, correo: widget.correo, numeroPedido:index + 1, nombre: widget.nombre, id: widget.id),
                                            ),
                                          );
                                        },
                                      ),
                                      ListTile(
                                        title: Text('PQRS para un pedido', style: TextStyle(fontSize: 16)),
                                        trailing: Icon(Icons.arrow_right, color: Colors.grey),
                                        onTap: () {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) => PqrsPagina(pedidoId: pedido.id, correo: widget.correo, nombre: widget.nombre, id: widget.id),
                                            ),
                                          );
                                        },
                                      ),
                                    ],
                                  ),
                                SizedBox(height: 5),
                                ],
                              ),
                            ),
                          ),
                        SizedBox(height: 20),
                      ],
                    ),
                  isExpanded: pedido.isExpanded,
                );
              }).toList(),
            ),
          ),
        ),
      ),
    );
  }
}

class Pedido {
  Pedido({
    required this.id,
    required this.total,
    required this.status,
    required this.fechaEntrega,
    required this.departamento,
    required this.ciudad,
    required this.direccionEntrega,
    this.isExpanded = false,
  });

  final String id;
  final double total;
  final String status;
  final String fechaEntrega;
  final String departamento;
  final String ciudad;
  final String direccionEntrega;
  bool isExpanded;

  factory Pedido.fromJson(Map<String, dynamic> json) {
    try {
      final envio = json['envio'] as Map<String, dynamic>? ?? {};
      final venta = envio['venta'] as Map<String, dynamic>? ?? {};
      final locaciones = json['locaciones'] as Map<String, dynamic>? ?? {};
      final direccionEntrega = locaciones['locacion'] ?? 'No especificada';

      String fechaEntregaFormatted = 'No especificada';
      if (venta['fechaEntrega'] != null) {
        try {
          final fechaEntrega = DateTime.parse(venta['fechaEntrega']);
          final formatter = DateFormat('yyyy-MM-dd hh:mm a');
          fechaEntregaFormatted = formatter.format(fechaEntrega);
        } catch (_) {
          fechaEntregaFormatted = 'Formato de fecha inválido';
        }
      }

      final subtotal = ((venta['subTotal'] as num?)!.toDouble() + (envio['totalEnvio']));

      return Pedido(
        id: envio['_id'] ?? '',
        total: subtotal,
        status: envio['estadoEnvio'] ?? 'Desconocido',
        fechaEntrega: fechaEntregaFormatted,
        departamento: locaciones['departamento'] ?? 'Departamento desconocido',
        ciudad: locaciones['ciudad'] ?? 'Ciudad desconocida',
        direccionEntrega: direccionEntrega,
      );
    } catch (e) {
      return Pedido(
        id: '',
        total: 0.0,
        status: 'Error al cargar datos',
        fechaEntrega: 'No especificada',
        departamento: 'No especificado',
        ciudad: 'No especificada',
        direccionEntrega: 'No especificada',
      );
    }
  }
}

void main() {
  runApp(MaterialApp(
    navigatorKey: navigatorKey,
    home: MyApp(),
  ));
}
