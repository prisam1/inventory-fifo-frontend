/// <reference types="@react-three/fiber" />
import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      color: any;
      primitive: any;
      trail: any;
      effectComposer: any;
      bloom: any;
    }
  }
}