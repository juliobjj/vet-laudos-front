export interface Patient {
  id: number;
  // Dados do Animal
  name: string;
  species: string;
  breed: string;
  dateBirth?: string;
  coat: string;
  sex: string;
  
  // Dados do Tutor
  ownerName: string;
  ownerPhone: string;
  ownerDocument: string;
  
  // Endereço
  address: string;
  addressNumber: string;
  neighborhood: string;
  zipCode: string;
  
  // Dados Clínicos
  insurance?: string;
  requestingDoctor: string;
  collectionOrigin: string;
  
  // Metadados
  createdAt: string;
  updatedAt: string;
}