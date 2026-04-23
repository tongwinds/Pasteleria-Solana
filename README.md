# 📜 Poemarios en Solana

> *"El arte es la forma más honesta de decir la verdad."*

## 🌟 Sobre el Proyecto

Este proyecto surgió de la necesidad de combinar mis diversos intereses en un solo lugar: mi trasfondo en **Lengua y Literatura**, mi pasión por la **Programación**, y mi más reciente conocimiento en **Web3 y crypto** con Solana.

Decidí crear este proyecto para comenzar a dar visibilidad a **artistas y poetas**, sin importar su historia o sus antecedentes. Creo firmemente que la **descentralización en los entornos artísticos y poéticos es justa y necesaria hoy en día**.

### 🎯 Nuestra Visión

Creo que **Solana tiene la oportunidad de darle el reconocimiento y el poder a los artistas sobre sus poemas y sus creaciones**. En esta plataforma, cada poeta mantiene el control total sobre su obra, pudiendo decidir cuándo y cómo compartir sus creaciones con el mundo.

### 💝 Inspiración

Este proyecto está inspirado en el álbum **"Poet | Artist"** de **Kim Jonghyun**, artista surcoreano que dejó este último álbum como prueba del poder artístico de la **honestidad y la humanidad**. Su legado nos recuerda que el arte verdadero nace de la autenticidad y la conexión humana, valores que queremos preservar en la era descentralizada.

---

## 🚀 Funcionalidades

- ✨ **Crear tu Poemario Personal**: Cada usuario puede crear su propia colección de poemas on-chain
- 📝 **Agregar Poemas de Diferentes Estilos**: Sonetos, haikus, romances, versos libres, y más
- 👁️ **Ver tu Colección**: Consulta todos los poemas guardados en tu poemario
- 🗑️ **Eliminar Poemas**: Gestiona tu colección eliminando obras que ya no desees mantener
- 🔒 **Control de Visibilidad**: Alterna entre estado público/privado para cada poema
- 💰 **Bajo Costo**: Gracias a Solana, publicar tus poemas cuesta fracciones de centavo

---

## 🏗️ Estructura del Programa

### Cuentas Principales

#### `Poemario`
La cuenta principal que almacena la colección de poemas de un usuario:
- `owner`: La clave pública del propietario del poemario
- `nombre`: Nombre del poemario (máximo 60 caracteres)
- `poemas`: Vector de hasta 10 poemas

#### `Poema`
Cada poema individual dentro del poemario:
- `titulo`: Título del poema (máximo 60 caracteres)
- `estilo`: Estilo literario (soneto, haiku, romance, etc.) - máximo 30 caracteres
- `versos`: Número de versos del poema
- `contenido`: El texto completo del poema (máximo 500 caracteres)
- `publicado`: Estado de visibilidad (true = público, false = privado)

---

## 🛠️ Instrucciones de Uso

### Paso 1: Importar el Proyecto a Solana Playground

1. Ve a [Solana Playground](https://beta.solpg.io/)
2. Haz clic en **"New Project"** → **"Import from GitHub"**
3. Pega la URL de este repositorio
4. ¡Listo! El proyecto se cargará automáticamente

### Paso 2: Configurar tu Entorno

1. Conecta tu wallet (Phantom, Solflare, etc.)
2. Asegúrate de estar en la red **devnet** para pruebas
3. Obtén SOL gratuito desde el faucet si es necesario

### Paso 3: Interactuar con el Programa

Puedes usar el cliente TypeScript incluido o interactuar directamente desde Solana Playground.

#### Ejemplo: Crear tu Primer Poemario

```typescript
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { IDL } from "./target/idl/poemarios.json";

// Configuración
const connection = new Connection("https://api.devnet.solana.com");
const provider = new AnchorProvider(connection, wallet, {});
const program = new Program(IDL, provider);

// Crear poemario
async function crearMiPoemario() {
  const tx = await program.methods
    .crearPoemario("Mis Poemas del Alma")
    .accounts({
      owner: wallet.publicKey,
    })
    .rpc();
  
  console.log("¡Poemario creado! Tx:", tx);
}
```

#### Ejemplo: Agregar un Soneto

```typescript
async function agregarSoneto() {
  const tx = await program.methods
    .agregarPoema(
      "Soneto de la Noche",
      "soneto",
      14,
      "En el silencio de la noche oscura,\ndonde las estrellas bailan sin cesar,\nmi alma busca paz en tu mirada..."
    )
    .accounts({
      owner: wallet.publicKey,
    })
    .rpc();
  
  console.log("¡Poema agregado! Tx:", tx);
}
```

#### Ejemplo: Agregar un Haiku

```typescript
async function agregarHaiku() {
  const tx = await program.methods
    .agregarPoema(
      "Amanecer",
      "haiku",
      3,
      "Luz dorada nace\nrocío besa la flor\nnuevo día empieza"
    )
    .accounts({
      owner: wallet.publicKey,
    })
    .rpc();
  
  console.log("¡Haiku agregado! Tx:", tx);
}
```

#### Ejemplo: Ver Todos tus Poemas

```typescript
async function verMisPoemas() {
  const [poemarioPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poemario"), wallet.publicKey.toBuffer()],
    program.programId
  );
  
  const poemario = await program.account.poemario.fetch(poemarioPda);
  console.log("Mis poemas:", poemario.poemas);
}
```

#### Ejemplo: Alternar Estado de Publicación

```typescript
async function publicarPoema(titulo: string) {
  const tx = await program.methods
    .alternarEstado(titulo)
    .accounts({
      owner: wallet.publicKey,
    })
    .rpc();
  
  console.log(`Poema "${titulo}" ahora es ${tx ? 'público' : 'privado'}`);
}
```

---

## 📁 Estructura del Proyecto

```
poemarios-solana/
├── Anchor.toml              # Configuración de Anchor
├── Cargo.toml               # Dependencias de Rust
├── programs/
│   └── poemarios/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs       # Contrato inteligente principal
├── tests/
│   └── anchor.test.ts       # Tests del programa
├── client/
│   └── client.ts            # Cliente TypeScript de ejemplo
└── README.md                # Este archivo
```

---

## 🔐 Consideraciones de Seguridad

- Solo el **propietario** del poemario puede modificar su contenido
- Cada poemario está asociado a una única wallet mediante PDA (Program Derived Address)
- Los poemas se almacenan **on-chain**, garantizando inmutabilidad y transparencia
- El estado `publicado` permite controlar la visibilidad sin eliminar el poema

---

## 🌍 Casos de Uso

1. **Poetas Emergentes**: Comparte tu trabajo con el mundo manteniendo la propiedad
2. **Colecciones Temáticas**: Crea poemarios especializados por estilo o tema
3. **Registro de Autoría**: Establece prueba de creación on-chain para tus obras
4. **Comunidades Literarias**: Grupos de poesía pueden crear colecciones colaborativas
5. **Legado Digital**: Preserva tus creaciones para las futuras generaciones

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el proyecto, añadir nuevos estilos literarios, o crear una interfaz frontend, por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📚 Recursos Adicionales

- [Documentación de Anchor](https://www.anchor-lang.com/docs)
- [Documentación de Solana](https://docs.solana.com/)
- [Solana Playground](https://beta.solpg.io/tutorials)
- [Kim Jonghyun - Poet | Artist Album](https://www.genius.com/albums/Jonghyun/Poet-artist)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de usarlo, modificarlo y distribuirlo.

---

## 💬 Contacto

Si tienes preguntas, sugerencias o quieres colaborar, no dudes en abrir un issue o contactarme directamente.

**"La poesía es el eco de la melodía del universo en el corazón de los humanos."** — Rabindranath Tagore

---

*Hecho con ❤️ para la comunidad de poetas y desarrolladores en Solana*

*En memoria de Kim Jonghyun, cuyo arte nos enseña que la honestidad y la humanidad son el corazón de toda creación verdadera.*
