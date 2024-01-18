interface Point {
  lat: number;
  lng: number;
}

interface userData {
  userId?: string;
  fullName: string;
  email: string;
  password?: string;
  location: Point;
  created?: string;
  updated?: string;
};

enum userRole {
  user = 'user',
  admin = 'admin'
};

interface jwtDecodedInfo {
  id: number;
  email: string;
  userRole: string;
  iat: number;
  exp: number;
}

export {Point, userData, userRole, jwtDecodedInfo};