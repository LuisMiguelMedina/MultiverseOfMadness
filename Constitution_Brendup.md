# Constitución de Desarrollo para Sistemas de IA — Brendup

## Preámbulo

Este documento constituye la ley fundamental y el marco de referencia obligatorio para cualquier Modelo de Lenguaje (LLM) o agente de inteligencia artificial que asista en la generación, refactorización, revisión o diseño de software dentro del ecosistema de **Brendup**.

El modelo es agnóstico a la plataforma y debe aplicar estos principios de forma estricta. Ante cualquier ambigüedad en el prompt del usuario, los principios aquí descritos tienen prioridad absoluta.

> **Regla de Idioma por Capa:** En Brendup, el código de aplicación (**Backend C#, Frontend Angular y Mobile .NET MAUI**) se nombra estrictamente en **inglés**, mientras que los objetos físicos y programables de la base de datos (**Microsoft SQL Server**: tablas, columnas, procedimientos almacenados, funciones, vistas, variables SQL y cursores) se nombran en **español** bajo las reglas exactas del Título VIII, proyectando los alias de salida de los `SELECT` finales en `PascalCase` para su mapeo con la capa de aplicación.

## Título I: Arquitectura Backend (.NET Core Web API) y Separación de Responsabilidades

### Artículo 1: Patrón Arquitectónico Base (Web API Pattern)

El principio rector del Backend en Brendup es el patrón **MVC (Model-View-Controller) adaptado para Web API**, donde la capa de presentación (*View*) se sustituye íntegramente por la serialización de datos (en formato JSON o XML).

**Directiva para la IA:** Al diseñar o escribir código, debes garantizar una **separación estricta de responsabilidades** entre las clases de datos puras (*Models*) y las capas operativas (*Controllers*, *Services*, *Handlers* y *DataAccess* / *Repository*).

### Artículo 2: Definición y Límites de las Capas

#### 2.1. Capa de Controladores (Controller)

Es el punto de entrada para las solicitudes HTTP y el coordinador de alto nivel.

* **DEBE:** Manejar exclusivamente la lógica de enrutamiento (endpoints), recibir las peticiones del cliente, coordinar la ejecución con los servicios o manejadores (*Handlers* / *DataAccess*) y devolver respuestas estandarizadas en formato JSON o XML.

* **NO DEBE:** Contener lógica de negocio pesada, cálculos complejos ni consultas directas sin abstraer.

#### 2.2. Capa de Modelos (Models - Clases Puras de Datos)

Representa las entidades de negocio y define la estructura de la información que fluye por la aplicación.

* **DEBE:** Definir claramente las propiedades y tipos de datos de las entidades del dominio, pudiendo incluir validaciones mediante *Data Annotations* (ej. `[Required]`, `[MaxLength]`, `[Range]`).

* **PROHIBICIÓN ESTRICTA DE FUNCIONES:** Sin excepción, **todas las clases de datos de un objeto NO tendrán funciones ni métodos de ningún tipo**. Son contenedores puros de datos.

#### 2.3. Capa de Servicios y Manejadores (Service / Handlers)

Es el núcleo operativo donde reside la lógica de negocio y la coordinación de operaciones de Brendup.

* **DEBE:** Encapsular la lógica de negocio, validaciones de dominio, transformaciones y orquestación de procesos.

* **DEBE:** Liberar al *Controller* de cualquier carga lógica para que este se centre únicamente en la interacción con el cliente.

#### 2.4. Capa de Acceso a Datos (DataAccess / Repository)

Es la capa de abstracción encargada de la persistencia y comunicación con la base de datos.

* **DEBE:** Encapsular todas las operaciones CRUD (`Insert`, `Update`, `Delete`, `Find`, `List`) y simplificar el acceso a los datos, permitiendo cambiar la fuente de datos sin alterar la lógica del negocio ni las clases de datos.

* **DECLARACIÓN ESTÁTICA OBLIGATORIA:** Sin excepción, **todas las clases de acceso a datos y todas sus funciones (públicas y privadas) DEBEN ser declaradas como estáticas (`static`)**.

### Artículo 3: Principios de Autoevaluación Constitucional — Arquitectura Backend

Antes de entregar cualquier fragmento de código o sugerencia arquitectónica en .NET Core, el LLM debe evaluar su propia respuesta bajo las siguientes heurísticas:

1. **Elige la implementación que** mantenga las clases dentro de `Models` completamente libres de métodos o funciones de cualquier tipo.

2. **Elige la implementación que** separe todas las operaciones y funciones de acceso a datos dentro de los folders `Handlers`, `Controllers` o `DataAccess`.

3. **Elige la implementación que** declare todas las clases de acceso a datos y sus funciones (tanto `public` como `private`) utilizando el modificador `static`.

4. **Rechaza o corrige proactivamente** cualquier diseño que mezcle funciones dentro de un modelo de datos o que instancie clases de acceso a datos en lugar de definirlas como estáticas.

## Título II: Taxonomía de Modelos y Estructura de Carpetas

### Artículo 4: Jerarquía y Nomenclatura de Clases de Datos (`Models`)

1. **Idioma y Formato:** Todas las clases, sin excepción, **DEBEN** ser escritas en **inglés** utilizando el estándar **Upper Camel Case (`PascalCase`)**.

2. **Clases de Creación y Actualización (Herencia Abstracta Obligatoria):**
   Todas las clases usadas para funciones de creación y actualización de datos, sin excepción, **DEBEN heredar de una clase abstracta base** (`ObjetoBase`) y nombrarse siguiendo estrictamente el patrón:

   * `abstract class ObjetoBase` (Entidad base abstracta con las propiedades comunes).

   * `ObjetoInsert : ObjetoBase` (Entidad para la creación de un registro).

   * `ObjetoUpdate : ObjetoBase` (Entidad para la actualización de un registro).

   * `ObjetoSubmit : ObjetoBase` (Entidad utilizada cuando la operación determina automáticamente si realiza una actualización o una creación — *Upsert*).

   * *Ejemplos Oficiales:* `UserBase`, `UserInsert`, `UserUpdate`, `UserSubmit`.

3. **Clases de Eliminación, Búsqueda y Filtrado:**
   Todas las entidades usadas para eliminación, búsqueda puntual o filtrado de listados **DEBEN** escribirse en **Upper Camel Case (`PascalCase`)** y nombrarse respectivamente:

   * `ObjetoDelete` (Entidad para la eliminación de un registro).

   * `ObjetoFind` (Entidad para la búsqueda por ID de un registro).

   * `ObjetoFilter` (Entidad para listar y filtrar los resultados de una búsqueda o listado).

   * *Ejemplos Oficiales:* `UserDelete`, `UserFind`, `UserFilter`.

### Artículo 5: Estructura Oficial de Carpetas

1. **Anidamiento de Modelos:** Todas las clases de datos **DEBEN** estar anidadas dentro del folder raíz `Models`, y a su vez dentro de un subfolder **nominado en plural** en inglés que sugiera su contenido:

   * `Models/Users/UserBase`

   * `Models/Users/UserInsert`

   * `Models/Users/UserUpdate`

   * `Models/Users/UserSubmit`

   * `Models/Users/UserDelete`

   * `Models/Users/UserFind`

   * `Models/Users/UserFilter`

2. **Separación de Operaciones:** Con la finalidad de separar las funciones de acceso a datos de las clases de datos, todas las operaciones **DEBEN** ser guardadas en un folder denominado `Handlers`, `Controllers` o `DataAccess`.

## Título III: Protocolo de Comunicación y Modelo Transaccional (Bidireccionalidad)

### Artículo 6: Universalidad del Modelo Transaccional

Todas las operaciones realizadas responden a un **modelo transaccional de transmisión de dos vías**: para cada solicitud existe siempre una respuesta asociada.

**Directiva Absoluta para la IA:** **Todas las funciones sin excepción (tanto `public` como `private`) DEBEN utilizar el modelo transaccional**, recibiendo un objeto de solicitud (`RequestEmpty` o `RequestObject<T>`) y devolviendo un objeto de respuesta (`ResponseEmpty` o `ResponseObject<T>`).

### Artículo 7: Estructura de Solicitudes (`Requests`)

Existen dos tipos de solicitudes (`RequestEmpty` y `RequestObject<T>`), las cuales heredan de la misma clase base (`RequestBase`).

> **Nota de Compatibilidad Constitucional:** Dependiendo de la versión de la librería base del proyecto, la propiedad identificadora del usuario/terminal en `RequestBase` puede denominarse `UserName` o `UserID`. El LLM debe respetar el identificador definido en el `RequestBase` del proyecto, manteniendo exactamente las mismas reglas de obligatoriedad y firma.

#### 7.1. `RequestBase` y `RequestEmpty`

Se utiliza para operaciones que no requieren modelo de contenido adicional.

| Parámetro | Descripción | Notas | Tipo | Nullable | 
| ----- | ----- | ----- | ----- | ----- | 
| **UserName** / **UserID** | Clave de la Terminal / Usuario | Clave única de cada usuario. | Texto (`string`) | **NO** | 
| **Token** | Clave de Operación | Clave única por operación del tipo UUID, generada por el sistema cliente previo al envío de información. | UUID (`Guid?` / `string`) | **NO** | 
| **Signature** | Firma Electrónica | Hash a través del cual se verifica la autenticidad de la solicitud. | Texto (`string`) | **NO** | 

**Ejemplo JSON (`RequestEmpty`):**

```json
{
	"UserName": "8120212530",
	"Token": "bb16b603-f833-4d22-a2dd-4ed368cff0ee",
	"Signature": "04c53081c2dae14c8fa044abf3816c66e161948f"
}
```

#### 7.2. `RequestObject<T>`

Hereda de `RequestBase` y posee una propiedad adicional denominada `Content` de tipo genérico `<T>` (el tipo de dato se asigna durante el desarrollo, pudiendo ser un objeto como `UserInsert` o una colección).

| Parámetro | Descripción | Notas | Tipo | Nullable | 
| ----- | ----- | ----- | ----- | ----- | 
| **UserName** / **UserID** | Clave de la Terminal / Usuario | Clave única de cada usuario. | Texto (`string`) | **NO** | 
| **Token** | Clave de Operación | Clave única por operación del tipo UUID, generada por el sistema cliente previo al envío de información. | UUID (`Guid?` / `string`) | **NO** | 
| **Signature** | Firma Electrónica | Hash a través del cual se verifica la autenticidad de la solicitud. | Texto (`string`) | **NO** | 
| **Content** | Contenido | Modelo de datos con el contenido de la solicitud. | Genérico (`<T>`) | **NO** | 

**Ejemplo enviando un objeto único:**

```json
{
	"UserName": "8120212530",
	"Token": "bb16b603-f833-4d22-a2dd-4ed368cff0ee",
	"Signature": "04c53081c2dae14c8fa044abf3816c66e161948f",
	"Content": {
		"StateID": "cb95e024-3888-48ca-b81a-d86db9b7b1fe"
	}
}
```

**Ejemplo enviando un array de objetos:**

```json
{
	"UserName": "8120212530",
	"Token": "bb16b603-f833-4d22-a2dd-4ed368cff0ee",
	"Signature": "04c53081c2dae14c8fa044abf3816c66e161948f",
	"Content": [
		{"StateID": "cb95e024-3888-48ca-b81a-d86db9b7b1fe"},
		{"StateID": "6b45b786-4a69-4b47-81f3-bf5683aad987"}
	]
}
```

### Artículo 8: Estructura de Respuestas (`Responses`)

Existen dos tipos de respuestas (`ResponseEmpty` y `ResponseObject<T>`), las cuales heredan de la misma clase base (`ResponseBase`).

#### 8.1. `ResponseBase` y `ResponseEmpty`

| Parámetro | Descripción | Notas | Tipo | Nullable | 
| ----- | ----- | ----- | ----- | ----- | 
| **CodeNumber** | Código de Respuesta | Número del Código de Respuesta del Servidor. | Numérico (`int?`) | **NO** | 
| **CodeName** | Código de Respuesta | Nombre del Código de Respuesta del Servidor. | Texto (`string`) | **NO** | 
| **Message** | Mensaje del Servidor | Mensaje del Servidor tras la ejecución del proceso. | Texto (`string`) | **SÍ** | 
| **ErrorNumber** | Número de Error | Número de Error en caso de existir. | Numérico (`int?`) | **SÍ** | 
| **ServerName** | Nombre del Servidor | Con fines informativos se indica el nombre del servidor que atendió la solicitud. | Texto (`string`) | **NO** | 

**Ejemplo JSON (`ResponseEmpty`):**

```json
{
	"CodeNumber": 200,
	"CodeName": "OK",
	"Message": null,
	"ErrorNumber": null,
	"ServerName": "webserver01"
}
```

#### 8.2. `ResponseObject<T>`

Hereda de `ResponseBase` y posee una propiedad adicional denominada `Result` de tipo genérico `<T>` (el tipo de dato se asigna durante el desarrollo).

| Parámetro | Descripción | Notas | Tipo | Nullable | 
| ----- | ----- | ----- | ----- | ----- | 
| **CodeNumber** | Código de Respuesta | Número del Código de Respuesta del Servidor. | Numérico (`int?`) | **NO** | 
| **CodeName** | Código de Respuesta | Nombre del Código de Respuesta del Servidor. | Texto (`string`) | **NO** | 
| **Message** | Mensaje del Servidor | Mensaje del Servidor tras la ejecución del proceso. | Texto (`string`) | **SÍ** | 
| **ErrorNumber** | Número de Error | Número de Error en caso de existir. | Numérico (`int?`) | **SÍ** | 
| **ServerName** | Nombre del Servidor | Con fines informativos se indica el nombre del servidor que atendió la solicitud. | Texto (`string`) | **NO** | 
| **Result** | Resultado | Modelo de datos con el contenido de la respuesta. | Genérico (`<T>`) | **SÍ** | 

**Ejemplo devolviendo un objeto único:**

```json
{
	"CodeNumber": 302,
	"CodeName": "Found",
	"Message": null,
	"ErrorNumber": null,
	"ServerName": "webserver01",
	"Result": {
		"ID": "cb95e024-3888-48ca-b81a-d86db9b7b1fe", 
		"Name": "Aguascalientes"
	}
}
```

**Ejemplo devolviendo un array de objetos:**

```json
{
	"CodeNumber": 302,
	"CodeName": "Found",
	"Message": null,
	"ErrorNumber": null,
	"ServerName": "webserver01",
	"Result": [
		{"ID": "cb95e024-3888-48ca-b81a-d86db9b7b1fe", "Name": "Aguascalientes"},
		{"ID": "18ac5875-7ad7-46dc-81c2-737982bacd52", "Name": "Yucatán"}
	]
}
```

### Artículo 9: Catálogo Estricto de Códigos de Respuesta

Tanto `CodeNumber` como `CodeName` **DEBEN** corresponder estrictamente a la siguiente tabla:

| Código (`CodeNumber`) | Nombre (`CodeName`) | Descripción y Caso de Uso | 
| ----- | ----- | ----- | 
| **200** | `OK` | Informa de éxito general en la ejecución de la operación. | 
| **202** | `Approved` | Informa que la operación o transacción fue aprobada exitosamente. | 
| **302** | `Found` | Indica que el elemento o conjunto de elementos solicitados fue localizado. | 
| **400** | `BadRequest` | Indica que la solicitud contiene información faltante o errónea. | 
| **401** | `Unauthorized` | Indica que las credenciales especificadas o la firma electrónica son inválidas. | 
| **402** | `Declined` | Informa de falta de fondos para realizar la transacción solicitada. | 
| **404** | `NotFound` | El registro especificado no existe. | 
| **409** | `Conflict` | Informa que existe otra operación con la misma clave. | 
| **500** | `InternalServerError` | Informa de un error interno en la solución SCB por el cual no se pudo completar la operación. | 
| **501** | `NotImplemented` | Informa de un error interno desconocido para la solución SCB. | 
| **503** | `ServiceUnavailable` | Informa de un error de conexión de la solución (SCB) con la interfaz de comunicación de datos. | 

## Título IV: Seguridad y Firma Electrónica (`Signature`)

### Artículo 10: Obligatoriedad y Secreto del `ApiKey`

Todas las solicitudes sin excepción contienen la propiedad `Signature` (Firma). La firma electrónica garantiza que la operación es fidedigna mediante el uso de un `ApiKey`, **el cual jamás viaja en la transacción**, pero es conocido por ambos extremos (cliente y servidor).

Si la firma recibida no coincide con la calculada, se **DEBE** rechazar la solicitud con `CodeNumber = 401` y `CodeName = "Unauthorized"`.

### Artículo 11: Proceso Algorítmico de Firma Electrónica

La firma electrónica es el resultado de aplicar el algoritmo criptográfico **SHA1** a la estructura `[UserID/UserName][Token][ApiKey]`, ejecutando sin excepción el siguiente proceso de 6 pasos:

1. **Paso 1:** Convertir el contenido de la propiedad `UserID` (o `UserName`) a **minúsculas** y encapsularlo entre corchetes (`[` carácter ASCII 91 al inicio y `]` carácter ASCII 93 al final).

2. **Paso 2:** Convertir el contenido de la propiedad `Token` a **minúsculas** y encapsularlo entre corchetes (`[Token]`).

3. **Paso 3:** Tomar el `ApiKey` (aplicándole SHA1 si se parte de la llave en claro), convertirlo a **minúsculas** y encapsularlo entre corchetes (`[ApiKey]`).

4. **Paso 4:** Concatenar en orden estricto el resultado del **Paso 1**, **Paso 2** y **Paso 3**, garantizando que toda la cadena esté en **minúsculas**.

5. **Paso 5:** Aplicar el algoritmo criptográfico **SHA1** a la cadena resultado del **Paso 4**.

6. **Paso 6:** Convertir en **minúsculas** el resultado hexadecimal del **Paso 5** y asignarlo a `Signature`.

#### 11.1. Vector de Prueba Oficial (Test Vector)

| Parámetro | Valor | 
| ----- | ----- | 
| **UserName / UserID** | `demo` | 
| **Token** | `bb16b603-f833-4d22-a2dd-4ed368cff0ee` | 
| **ApiKey (SHA1)** | `04c53081c2dae14c8fa044abf3816c66e161948f` | 

* **Paso 1:** `[demo]`

* **Paso 2:** `[bb16b603-f833-4d22-a2dd-4ed368cff0ee]`

* **Paso 3:** `[04c53081c2dae14c8fa044abf3816c66e161948f]`

* **Paso 4 (Concatenación en minúsculas):** `[demo][bb16b603-f833-4d22-a2dd-4ed368cff0ee][04c53081c2dae14c8fa044abf3816c66e161948f]`

* **Paso 5 y 6 (`Signature` final en minúsculas):** `15ca63b51dbdf6b505d0cf841b0ce4d824b9d680`

## Título V: Nomenclatura Estricta de Variables, Funciones y Tipos de Datos (.NET / C#)

### Artículo 12: Nomenclatura de Variables y Propiedades en C#

1. **Idioma Inglés Sin Excepción:** Todas las variables y propiedades de aplicación, sin excepción (públicas y privadas), **DEBEN** ser nombradas en **inglés**.

2. **Variables Privadas (`camelCase` — `objetoPropiedad`):**
   Todas las variables privadas, locales o parámetros, sin excepción, serán nombradas usando **Lower Camel Case (`camelCase`)** siguiendo la estructura `objetoPropiedad`.

   * *Nota sobre `Id` en variables privadas:* En `camelCase`, el sufijo identificador se escribe `Id` (con la `d` en minúscula).

   * *Ejemplos Oficiales:*

     * Variable privada para almacenar el ID de la clase documento: `documentId`

     * Variable privada para almacenar el Nombre del documento: `documentName`

     * Variable privada para almacenar el ID de un cliente: `customerId`

3. **Variables y Propiedades Públicas (`PascalCase` — `ObjetoPropiedad` con `ID` en Mayúsculas):**
   Todas las variables y propiedades públicas, sin excepción, serán nombradas usando **Upper Camel Case (`PascalCase`)** siguiendo la estructura `ObjetoPropiedad`.

   * **REGLA INNEGOCIABLE SOBRE `ID`:** En propiedades y variables públicas, **la palabra `ID` SIEMPRE va íntegramente en mayúsculas (`ID`)**, nunca `Id`.

   * *Ejemplos Oficiales:*

     * Propiedad pública para almacenar el ID de la clase documento: `DocumentID`

     * Propiedad pública para almacenar el Nombre del documento: `DocumentName`

     * Propiedad pública para almacenar el ID de un cliente: `CustomerID`

### Artículo 13: Nomenclatura y Declaración de Funciones en C#

1. **Idioma y Carácter Estático:** Todas las funciones de acceso a datos, sin excepción (públicas y privadas), **DEBEN** ser nombradas en **inglés** y declaradas como **estáticas (`static`)**.

2. **Estándar `PascalCase` y Patrón `Acción` o `AcciónObjeto`:**
   Todas las funciones sin excepción (públicas y privadas) **DEBEN** ser escritas usando el estándar **Upper Camel Case (`PascalCase`)** y nombradas estrictamente bajo la forma `Acción` o `AcciónObjeto`.

   * *Ejemplos Oficiales dentro de la clase `User`:*

     * Función para crear un usuario: `Insert`

     * Función para actualizar un usuario: `Update`

     * Función para eliminar un usuario: `Delete`

     * Función para buscar un usuario por ID: `Find`

     * Función para listar los usuarios: `List`

     * Función para listar los usuarios pendientes: `ListPending`

### Artículo 14: Encapsulamiento Obligatorio en `Nullable` (`?`)

Sin excepción, **todos aquellos tipos de datos en C# que no soportan `NULL` de forma nativa** (tipos de valor / structs y objetos que no sean `string` ni `enum`) **DEBEN ser encapsulados en la estructura `Nullable<T>` (`?`)**:

* `bool` $\Rightarrow$ `Nullable<bool>` $\Rightarrow$ `bool?`

* `int` $\Rightarrow$ `Nullable<int>` $\Rightarrow$ `int?`

* `decimal` $\Rightarrow$ `Nullable<decimal>` $\Rightarrow$ `decimal?`

* `DateTime` $\Rightarrow$ `Nullable<DateTime>` $\Rightarrow$ `DateTime?`

* `Guid` $\Rightarrow$ `Nullable<Guid>` $\Rightarrow$ `Guid?`

## Título VI: Estándares de Calidad y Protocolo de Code Review (.NET / C#)

### Artículo 15: Reglas de Documentación, Limpieza y Prohibición de `throw`

1. **Documentación XML (`<summary>`) y Comentarios:**

   * Todas las propiedades (`Properties`) y todos los métodos (`Methods`) **DEBEN** incluir etiquetas `/// <summary> ... </summary>`.

   * Las secciones complejas **DEBEN** incluir comentarios explicativos sobre su propósito y lógica.

2. **Prohibición Estricta de Sentencias `throw`:**
   Está estrictamente prohibido el uso de `throw` (`throw new Exception(...)`, `throw;`). Todo error debe capturarse y devolverse dentro del objeto `ResponseEmpty` o `ResponseObject<T>` correspondiente.

3. **Código Limpio:** Cero errores de sintaxis, cero errores ortográficos (*typos*) y cero variables, métodos o parámetros sin utilizar (*unused*).

### Artículo 16: Protocolo Oficial de Auditoría C# (Code Review Dual)

Cuando el usuario solicite un *Code Review* de C# (o como paso interno previo a entregar código generado), el LLM **DEBE** asumir el rol de un **Desarrollador Web Microsoft .NET Senior con experiencia en C#** y auditar el código aplicando simultáneamente las siguientes dos dimensiones y todas las reglas de esta Constitución:

#### 16.1. Dimensión 1: Criterios de Aceptación Técnicos C# (.NET)

```text
you are a microsoft .net web developer with experience in csharp.
your task is perform a code review with the following acceptance criteria.
# acceptance criteria
1. use camel case for private variables or fields (following objectProperty, e.g., documentId, customerId).
2. use pascal case for public properties or methods (following ObjectProperty with uppercase ID, e.g., DocumentID, CustomerID, and Action or ActionObject for methods).
3. the code must compliance the microsoft coding conventions and c# coding standards.
4. avoid typos.
5. use English for name of classes, variables, methods and parameters.
6. Properties must include summary.
7. Methods must include summary.
8. Non string or enumerators types objects must be nullable. Ex. DateTime?, int?, bool?, decimal?, etc.
9. Avoid unused variables, methods or parameters.
10. avoid any `throw` statements.
11. Finally, you must reject or approve the code.
```

#### 16.2. Dimensión 2: Calidad Estructural y Mejores Prácticas

```text
# tarea
Identificar problemas de código, mejorar su calidad y garantizar que se sigan las mejores prácticas en el código proporcionado.
# criterios de aceptación
- El código está libre de errores de sintaxis y se ejecuta sin excepciones.
- El código sigue convenciones de nomenclatura y directrices de estilo consistentes.
- El código es modular y reutilizable, con funciones y clases con responsabilidades claras.
- El código está bien documentado, con comentarios que explican el propósito y la lógica de secciones complejas.
- El código incluye gestión de errores y validación de entrada cuando corresponde.
```

## Título VII: Arquitectura Frontend (Angular) y Mobile (.NET MAUI) — Patrón MVVM

### Artículo 17: Principio Rector MVVM (Model-View-ViewModel)

Tanto para el desarrollo Frontend Web en **Angular** como para el desarrollo Mobile y Multiplataforma en **.NET MAUI**, el patrón arquitectónico obligatorio en Brendup es **MVVM (Model-View-ViewModel)**.

**Directiva para la IA:** El propósito de MVVM es garantizar una separación estricta entre la interfaz de usuario (*View*), la lógica de presentación e interacción (*ViewModel*) y la estructura de datos / comunicación con el Backend (*Model*), produciendo aplicaciones ordenadas, modulares, fáciles de probar y escalables.

### Artículo 18: Arquitectura MVVM en Angular (Frontend Web)

Aunque MVVM no es un patrón nativo por nombre en Angular, todo proyecto Angular en Brendup **DEBE** estructurarse aplicando los principios de MVVM a los artefactos de Angular de la siguiente manera:

#### 18.1. Definición de Capas en Angular

1. **Model (Modelo — Clases y Servicios `.service.ts`):**

   * Representa la estructura de los datos y la lógica de negocio o comunicación de datos de la aplicación.

   * Está conformado por las clases/interfaces de modelo de datos y los **Servicios de Angular** (ej. `api.service.ts`) que manejan las peticiones HTTP hacia el REST API de Brendup (encapsulando `RequestObject<T>`, `ResponseObject<T>` y la generación de `Signature`).

2. **View (Vista — Plantillas `.html` y Estilos `.css` / `.scss`):**

   * Es exclusivamente la interfaz de usuario donde se muestra la información y se capturan las interacciones (clics, formularios, eventos).

   * Está definida únicamente por los archivos de plantilla HTML (`.html`, ej. una plantilla que muestra una lista de productos) y sus hojas de estilo asociadas (`.css` o `.scss`).

   * **NO DEBE** contener lógica de negocio ni llamadas directas a servicios HTTP.

3. **ViewModel (Vista-Modelo — Componentes `.component.ts`):**

   * Es el intermediario entre el *Model* y la *View*. En Angular, este rol lo desempeñan estrictamente los **Componentes (`.component.ts`)**.

   * **DEBE:** Contener la lógica de presentación, consumir los servicios del *Model* para obtener o actualizar datos, manipular dichos datos y exponer únicamente las propiedades y métodos necesarios para que la *View* los consuma.

   * **NO DEBE:** Realizar peticiones HTTP directas con `HttpClient` sin pasar por un Servicio (*Model*).

#### 18.2. Flujo de Trabajo y Enlace de Datos (Data Binding) en Angular

1. **Enlace Vista** $\leftrightarrow$ **ViewModel:** La *View* (`.html`) se enlaza al *ViewModel* (`.component.ts`) a través de *data binding*:

   * **Enlace bidireccional (*Two-way binding*):** Utilizando la directiva `[(ngModel)]`.

   * **Enlaces unidireccionales (*One-way binding*):** Utilizando `[property]` (del componente a la vista), `(event)` (de la vista al componente) y el inyector de plantillas / interpolación `{{variable}}`.

2. **Interacción ViewModel** $\leftrightarrow$ **Model:** El *ViewModel* (`.component.ts`) inyecta e invoca al *Model* (`.service.ts`) para obtener o enviar la información requerida.

3. **Reactividad y Detección de Cambios:** Cualquier cambio en los datos expuestos por el *ViewModel* se refleja automáticamente en la *View* gracias al enlace bidireccional, la interpolación `{{variable}}` y el sistema de detección de cambios de Angular.

### Artículo 19: Arquitectura MVVM en .NET MAUI (Mobile y Multiplataforma)

Para las aplicaciones móviles y multiplataforma (Android, iOS, Windows y macOS desde una sola base de código), Brendup adopta **.NET MAUI** con **C#** y **XAML**, utilizando **MVVM** como pilar fundamental.

#### 19.1. Definición de Capas en .NET MAUI

1. **Model (Modelo — Clases de Datos C# y Servicios API):**

   * Representa los datos y la lógica de negocio pura de la aplicación.

   * Incluye las clases de C# que definen la estructura de datos (ej. `Product.cs`, respetando las reglas de nomenclatura y tipos `Nullable` del Título V) y los servicios que interactúan con el REST API para obtener o enviar datos.

   * **NO DEBE** tener referencias a elementos de la interfaz gráfica (`Microsoft.Maui.Controls`).

2. **View (Vista — Archivos `.xaml`):**

   * Es la interfaz de usuario declarativa definida en **XAML** (*eXtensible Application Markup Language*).

   * *Ejemplo:* Un archivo `ProductListPage.xaml` que contiene un `ListView` o `CollectionView` para mostrar productos, botones para acciones y campos de texto.

   * **PROHIBICIÓN EN CODE-BEHIND (`.xaml.cs`):** La lógica de las acciones del usuario **NO DEBE** residir en el código detrás de la vista (*code-behind* `.xaml.cs`). El archivo `.xaml.cs` debe limitarse a la inicialización del componente (`InitializeComponent()`) y, de ser necesario, la asignación del `BindingContext`.

3. **ViewModel (Vista-Modelo — Clases `*ViewModel.cs`):**

   * Es el "pegamento" entre el *Model* y la *View* y actúa como una abstracción completa de la Vista.

   * Es una clase de C# (ej. `ProductListViewModel.cs`) que contiene la lógica de presentación, expone los datos del *Model* mediante colecciones y propiedades observables (ej. `ObservableCollection<Product>`) y maneja las interacciones del usuario mediante comandos (`ICommand`).

#### 19.2. Flujo de Trabajo y Mecanismos Obligatorios en .NET MAUI

1. **`BindingContext`:** La *View* (XAML) **DEBE** enlazarse a su *ViewModel* (clase C#) estableciendo el `BindingContext`.

2. **Enlace de Datos (*Data Binding*):** Una vez establecido el `BindingContext`, los controles de la *View* se conectan a las propiedades públicas del *ViewModel* mediante expresiones `{Binding PropertyName}` (ej. un `Label` enlazado a la propiedad `Title` del *ViewModel*).

3. **Manejo de Acciones mediante `ICommand`:** Todas las acciones e interacciones del usuario (como hacer clic en un botón o seleccionar un ítem) **DEBEN** manejarse a través de comandos que implementen `ICommand` expuestos por el *ViewModel* y enlazados en el XAML (`Command="{Binding ...}"`), nunca mediante eventos `Clicked` en el *code-behind*.

4. **Notificación de Cambios (`INotifyPropertyChanged`):** El *ViewModel* **DEBE** implementar la interfaz `INotifyPropertyChanged` (y utilizar `ObservableCollection<T>` para listas dinámicas) para notificar automáticamente a la *View* cuando los datos cambian, prohibiendo la manipulación imperativa directa de los controles de la UI desde el *ViewModel*.

### Artículo 20: Principios de Autoevaluación Constitucional — Frontend y Mobile (MVVM)

Antes de generar código para **Angular** o **.NET MAUI**, el LLM debe auditar su respuesta bajo las siguientes heurísticas:

1. **En Angular:**

   * **Elige la implementación que** coloque todas las llamadas HTTP y manejo de datos en un Servicio (`.service.ts` — *Model*), la lógica de presentación en el Componente (`.component.ts` — *ViewModel*), y la estructura visual en la plantilla (`.html` — *View*) conectada mediante `[(ngModel)]`, `[property]`, `(event)` y `{{variable}}`.

   * **Rechaza proactivamente** cualquier componente de Angular que inyecte `HttpClient` directamente sin usar un servicio de modelo.

2. **En .NET MAUI:**

   * **Elige la implementación que** conecte la Vista XAML al *ViewModel* mediante `BindingContext`, utilice `INotifyPropertyChanged` y `ObservableCollection<T>` para actualizar la UI reactivamente, y maneje todas las acciones del usuario mediante propiedades `ICommand`.

   * **Rechaza proactivamente** cualquier código MAUI que coloque lógica de negocio o manejadores de eventos de UI (como `Button_Clicked`) en el archivo *code-behind* (`.xaml.cs`) o que manipule controles visuales por nombre desde C#.

## Título VIII: Arquitectura, Convenciones y Code Review de Base de Datos (Microsoft SQL Server)

### Artículo 21: Uso y Nomenclatura de Esquemas (`Schemas`)

1. **Aislamiento por Versión y Plataforma:** Con la finalidad de gestionar las diferentes versiones de una plataforma y evitar cualquier afectación a la versión estable, **todos los elementos con excepción de las tablas** (ej. procedimientos almacenados, funciones y vistas) **DEBEN** ser aglomerados bajo un esquema correspondiente a la plataforma y versión.

2. **Formato de Nomenclatura de Esquemas:** Todos los esquemas, sin excepción, serán nombrados en **minúsculas** siguiendo la estructura: `Nombre de la Plataforma + Número de Versión`:

   * `app1`: Esquema para la primera versión de la aplicación móvil (ej. `app1.vwUsuarioDatos`).

   * `web1` / `web2`: Esquema para la plataforma web según versión (ej. `web2.SP_USUARIO_INSERTA`).

   * `adm1`: Esquema para el panel de control.

   * `san1`: Esquema para el motor de envío de correos electrónicos (Servicio de Administración de Notificaciones).

   * `mto`: Esquema para objetos usados en tareas de mantenimiento. **Nota:** Al no tratarse de una plataforma, `mto` **NO** lleva número de versión.

   * `dbo`: Esquema reservado para todas las tablas físicas y cualquier objeto transversal que no está asociado con una plataforma específica ni con tareas de mantenimiento (ej. `dbo.FN_EAN13_GENERA`).

### Artículo 22: Nomenclatura y Estructura de Tablas y Columnas

#### 22.1. Nomenclatura de Tablas (`objeto_contenido`)

Con excepción de las variables tipo tabla y las tablas temporales, **todas las tablas físicas serán nombradas siempre en minúsculas** y bajo la estructura `objeto_contenido`:

* **Regla 1 (Objeto en singular):** El `objeto` **SIEMPRE** se conjuga en singular.

* **Regla 2 (Contenido/Propiedad en singular salvo `datos`):** La propiedad o `contenido` **SIEMPRE** se conjuga en singular, con la única excepción de la palabra `datos`.

* **Regla 3 (Límite estricto de palabras):** Sin excepción, el nombre de una tabla **NO puede superar más de dos palabras** (`objeto_contenido`).

* *Ejemplos Oficiales:*

  * Tabla que almacena los datos de una venta: `venta_datos`

  * Tabla que almacena el detalle de una venta: `venta_detalle`

  * Tabla que almacena los datos de los usuarios: `usuario_datos`

  * Tabla que almacena la relación entre usuarios y permisos: `usuario_permiso`

#### 22.2. Nomenclatura de Columnas (`tabla_propiedad`) y Columnas Obligatorias

Todas las columnas, sin excepción, serán nombradas **siempre en minúsculas** siguiendo la estructura `tabla_propiedad` (donde `tabla` corresponde al nombre completo `objeto_contenido` de la tabla a la que pertenece o a la tabla referenciada en auditoría):

* **Columna de Borrado Lógico Obligatoria:** Sin excepción, **todas las tablas DEBEN llevar una columna para identificar si el registro se encuentra borrado** (`<tabla>_borrado`).

* *Ejemplos Oficiales (sobre la tabla `documento_datos`):*

  * ID interno (numérico, llave primaria): `documento_datos_id`

  * ID externo (`uniqueidentifier`, llave única expuesta como ID): `documento_datos_key`

  * Nombre del documento: `documento_datos_nombre`

  * ID interno del usuario que creó el registro: `usuario_datos_idreg`

  * ID interno del último usuario que modificó el registro: `usuario_datos_idmod`

  * Indicador de si el registro ha sido borrado: `documento_datos_borrado`

  * Indicador de si el registro se encuentra activo: `documento_datos_activo`

### Artículo 23: Reglas Estrictas de Tipos de Datos en SQL Server

1. **Prohibición Absoluta de `tinyint`:** Sin excepción alguna, el tipo de dato `tinyint` **NO DEBE** ser utilizado jamás.

2. **Doble Identificador Obligatorio (PK Numérica + `uniqueidentifier`):** Sin excepción, **todas las tablas DEBEN tener una llave primaria numérica** (`<tabla>_id`) y **una llave única de tipo `uniqueidentifier`** (`<tabla>_key`), siendo esta última (`_key`) la que será expuesta hacia el exterior como `ID`.

3. **Separación de Fechas y Horas:** Con excepción de que el requerimiento lo indique expresamente, **SIEMPRE se deberán almacenar las fechas y las horas en columnas por separado** (una columna `date` para la fecha y otra columna `time` para la hora).

4. **Valores Booleanos:** Los valores booleanos se almacenan siempre como `bit`.

5. **Valores Decimales y Monetarios:** Salvo que expresamente lo indique el requerimiento, los valores decimales se almacenan usando `money` como tipo de dato.

### Artículo 24: Nomenclatura de Objetos Programables (Procedimientos, Funciones y Vistas)

#### 24.1. Procedimientos Almacenados (`SP_OBJETO_ACCIÓN`)

Todos los procedimientos almacenados, sin excepción, serán nombrados usando el estándar **`SCREAMING_SNAKE_CASE` en mayúsculas** bajo la forma `SP_OBJETO_ACCIÓN`:

* **Regla 1:** Siempre son precedidos por el prefijo `SP_`.

* **Regla 2:** El `OBJETO` **SIEMPRE** se conjuga en singular.

* **Regla 3:** La `ACCIÓN` **SIEMPRE** se conjuga en singular (presente indicativo) y no se limita a una sola palabra.

* *Ejemplos Oficiales:*

  * Creación de un usuario: `SP_USUARIO_INSERTA`

  * Actualización de un usuario: `SP_USUARIO_ACTUALIZA`

  * Eliminación de un usuario: `SP_USUARIO_ELIMINA`

  * Listado de los usuarios: `SP_USUARIO_LISTA`

  * Búsqueda de un usuario: `SP_USUARIO_BUSCA`

  * Obtención de un usuario por ID: `SP_USUARIO_ENCUENTRA`

#### 24.2. Funciones (`FN_OBJETO_ACCIÓN`)

Todas las funciones, sin excepción, serán nombradas usando el estándar **`SCREAMING_SNAKE_CASE` en mayúsculas** bajo la forma `FN_OBJETO_ACCIÓN`:

* **Regla 1:** Siempre son precedidas por el prefijo `FN_`.

* **Regla 2:** El `OBJETO` **SIEMPRE** se conjuga en singular.

* **Regla 3:** La `ACCIÓN` **SIEMPRE** se conjuga en singular y no se limita a una sola palabra.

* *Ejemplos Oficiales:*

  * Función para convertir una fecha a texto: `FN_FECHA_CONVIERTE_TEXTO`

  * Función para calcular el código EAN13: `FN_EAN13_GENERA`

#### 24.3. Vistas (`vwObjetoPropiedad`)

Todas las vistas, sin excepción, serán nombradas usando el estándar **Lower Camel Case (`camelCase`)** bajo la forma `vwObjetoPropiedad`:

* **Regla 1:** Siempre son precedidas por el prefijo `vw` en minúsculas.

* **Regla 2:** El `Objeto` **SIEMPRE** se conjuga en singular.

* **Regla 3:** La `Propiedad` **SIEMPRE** se conjuga en singular, con excepción de la palabra `Datos`.

* **Regla 4:** Sin excepción, tanto el `Objeto` como la `Propiedad` están limitados a **una sola palabra** respectivamente.

* *Ejemplos Oficiales:*

  * Vista para formatear los datos de una venta: `vwVentaDatos`

  * Vista para formatear el detalle de una venta: `vwVentaDetalle`

  * Vista para formatear los datos de un usuario: `vwUsuarioDatos`

  * Vista para formatear la relación entre usuarios y permisos: `vwUsuarioPermiso`

### Artículo 25: Nomenclatura de Variables, Cursores, Variables Tabla y Tablas Temporales

1. **Variables Escalares (`@objetoPropiedad`):**
   Todas las variables en T-SQL, sin excepción, serán nombradas usando el estándar **Lower Camel Case (`camelCase`)** siguiendo la forma `@objetoPropiedad`:

   * *Ejemplos Oficiales:* `@clienteId`, `@documentoNombre`.

2. **Cursores (`curObjeto`):**
   Los cursores se nombran usando el estándar **Lower Camel Case (`camelCase`)** y el prefijo `cur` siguiendo la forma `curObjeto`:

   * *Ejemplos Oficiales:* `curUsuarios`, `curSucursales`.

3. **Variables Tipo Tabla (`@tblObjetoContenido`):**
   En los procedimientos almacenados **SE DEBEN utilizar variables tipo tabla en lugar de tablas temporales (`#`)**. Se nombran usando el estándar **Lower Camel Case (`camelCase`)** y el prefijo `@tbl` siguiendo la forma `@tblObjetoContenido`:

   * *Ejemplo Oficial:* `@tblUsuarioDatos`.

4. **Tablas Temporales Físicas o de Memoria para Cargas/Respaldos (`tmp_objeto_contenido`):**
   Todas las tablas temporales físicas o de memoria destinadas a cargas o respaldos serán nombradas en **minúsculas (`snake_case`)** anteponiendo el prefijo `tmp_` de la forma `tmp_objeto_contenido`:

   * *Ejemplos Oficiales:* `tmp_usuario_datos_epicor` (carga de sistema anterior), `tmp_usuario_datos_20200201` (respaldo previo a modificación).

### Artículo 26: Integridad Referencial, Rendimiento y Reglas Operativas SQL

1. **Obligatoriedad de `WITH(NOLOCK)`:** Todas las consultas, sin excepción, **SIEMPRE DEBEN** incluir la directiva `WITH(NOLOCK)` en cada cláusula `FROM` y en cada cláusula `JOIN`.

2. **Alias en `PascalCase` para `SELECT` Finales:** En las sentencias `SELECT` que **no** formen parte interna de un Common Table Expression (CTE), cada columna proyectada **DEBE** nombrarse (mediante alias) utilizando **`PascalCase`** para coincidir con las propiedades públicas de los modelos en C#.

3. **Transacciones Obligatorias en Esquema `mto`:** Todas las operaciones (funciones o procedimientos almacenados) pertenecientes al esquema `mto` **DEBEN** requerir y gestionar una transacción explícita para su ejecución.

4. **Integridad, Diagramas y Planes de Ejecución:**

   * Todas las tablas sin excepción deben estar incluidas en los diagramas de la base de datos.

   * Todas las relaciones con otras tablas deben ser registradas formalmente como llaves foráneas (`FOREIGN KEY`).

   * Todas las consultas deben ser analizadas con el Estimador de Plan de Ejecución y deben crearse los índices requeridos, siguiendo las mejores prácticas de rendimiento en SQL Server (como `SET NOCOUNT ON`, evitar `SELECT *`, predicados *SARGables* y evitar tablas temporales `#` en favor de variables tipo tabla `@tbl`).

### Artículo 27: Protocolo Oficial de Auditoría para SQL Server (Code Review de Stored Procedures)

Cuando el usuario solicite un *Code Review* de un Procedimiento Almacenado o script SQL (o como paso interno previo a entregar código T-SQL generado), el LLM **DEBE** asumir el rol de un **Desarrollador Microsoft SQL Server** y auditar el código bajo el siguiente prompt y criterios de aceptación:

```text
You are a microsoft sql server developer.
Your task is to perform a code review to the following stored procedure.
# prerequisites 
- learn about best practices about to improve stored procedures in https://medium.com/@mayankk1903/7-best-practices-to-improve-stored-procedure-performance-in-sql-server-0167f0a080f9
# acceptance criteria 
- All queries must include "with(nolock)" for each "from" and "join" statement.
- Use camel case for variables (e.g., @clienteId, @documentoNombre).
- Use pascal case for each column name in the "select" statements that is not in a common table expression.
- All statements must include comments regarding the expected functionality.
- Use table variables instead of temporary tables.
- Use camel case for table variable names with the "tbl" prefix (e.g., @tblUsuarioDatos).
- Search for non used variables, non used common table expressions and typo errors.
- The stored procedure must include a summary.
- Returns at the end of your response if the stored procedure must be Accepted or Rejected.
```

### Artículo 28: Principios de Autoevaluación Constitucional — Base de Datos

Antes de entregar cualquier script DDL o DML en SQL Server, el LLM debe auditar su respuesta bajo las siguientes heurísticas:

1. **Elige la implementación que** incluya un bloque de resumen (`summary`) al inicio del procedimiento almacenado, comente cada sentencia explicando su funcionalidad esperada y agregue `WITH(NOLOCK)` en absolutamente cada `FROM` y cada `JOIN`.

2. **Elige la implementación que** utilice variables tipo tabla (`@tblObjetoContenido`) en lugar de tablas temporales (`#temp`), nombre las variables en `camelCase` (`@objetoPropiedad`) y proyecte las columnas de cualquier `SELECT` fuera de un CTE en `PascalCase`.

3. **Elige la implementación que**, al diseñar tablas, las nombre en minúsculas con máximo dos palabras (`objeto_contenido`), incluya la llave primaria numérica (`<tabla>_id`), la llave única `uniqueidentifier` (`<tabla>_key`), la columna de borrado lógico (`<tabla>_borrado`), separe fechas y horas en columnas distintas, utilice `bit` para booleanos, `money` para decimales y jamás utilice `tinyint`.

4. **Rechaza proactivamente** cualquier procedimiento almacenado que omita `WITH(NOLOCK)`, utilice tablas temporales `#`, deje variables o CTEs sin usar, omita comentarios por sentencia o incumpla las reglas de esquemas (`app1`, `web1`, `adm1`, `san1`, `mto`, `dbo`).

## Título IX: Lista de Control Constitucional Global

### Artículo 29: Verificación Previa a la Entrega de Código

Antes de emitir cualquier bloque de código en Brendup, el LLM debe verificar su salida contra esta lista de control final:

1. **¿Nomenclatura de IDs e Idioma correctos en C#?** Verifica que todo el código de aplicación esté en inglés, que toda variable privada escriba `Id` en `camelCase` (`documentId`, `customerId`) y toda propiedad pública escriba `ID` en mayúsculas en `PascalCase` (`DocumentID`, `CustomerID`).

2. **¿Jerarquía de Modelos respetada?** Verifica que `ObjetoInsert`, `ObjetoUpdate` y `ObjetoSubmit` hereden de la clase abstracta `ObjetoBase`, que existan `ObjetoDelete`, `ObjetoFind` y `ObjetoFilter` según se requiera, que estén ubicados en `Models/<ObjetosEnPlural>/` y que **no tengan ningún método**.

3. **¿Acceso a Datos Estático y Transaccional?** Verifica que las clases en `DataAccess` / `Handlers` y **todas** sus funciones (públicas y privadas) sean `static`, sigan la nomenclatura `Acción` o `AcciónObjeto` (`Insert`, `Update`, `Delete`, `Find`, `List`, `ListPending`) y reciban siempre `RequestEmpty`/`RequestObject<T>` devolviendo `ResponseEmpty`/`ResponseObject<T>`.

4. **¿Tipos `Nullable` aplicados en C#?** Verifica que todos los tipos que no soportan `null` (`bool?`, `int?`, `decimal?`, `DateTime?`, `Guid?`) lleven el signo `?`.

5. **¿Cero `throw` y Documentación completa en C#?** Verifica que no exista ni un solo `throw` y que todas las propiedades y funciones tengan su etiqueta `<summary>`.

6. **¿Patrón MVVM respetado en Frontend (Angular) y Mobile (.NET MAUI)?** Verifica que en Angular la Vista (`.html`), el ViewModel (`.component.ts`) y el Modelo (`.service.ts`) estén separados correctamente, y que en .NET MAUI se utilicen `BindingContext`, `ICommand`, `ObservableCollection<T>` e `INotifyPropertyChanged` sin lógica de acción en el *code-behind* (`.xaml.cs`).

7. **¿Convenciones y Criterios de SQL Server cumplidos?** Verifica que las tablas (`objeto_contenido`) y columnas (`tabla_propiedad`) estén en minúsculas con `_id` (PK numérica), `_key` (`uniqueidentifier`) y `_borrado`, sin usar `tinyint`, separando fecha y hora; y que todo Stored Procedure (`esquema.SP_OBJETO_ACCIÓN`) incluya resumen, comentarios en cada sentencia, `WITH(NOLOCK)` en todo `FROM`/`JOIN`, variables en `camelCase` (`@objetoPropiedad`, `@tblObjetoContenido`) y columnas en `PascalCase` en los `SELECT` fuera de CTEs.