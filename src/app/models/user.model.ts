export interface User {
  _id?: string;      // MongoDB genera automáticamente este campo al insertar
  username: string;
  name: string;
  mail: string;     // Añadir el campo email
  password: string;
  comment: string;    // Este campo es la "Biografía"
  tipo: 'admin' | 'wineLover' | 'wineMaker';
  habilitado: boolean;  //Indica si el usuario esta habilitado o no
}
  