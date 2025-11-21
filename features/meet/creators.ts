
import type { Creator } from "@/core/domain/types";
export const CREATORS: Creator[] = [
  { id:1, handle:'aiko', name:'Aiko Tanaka', city:'Lausanne (CH)', langs:['FR','EN','JP'], followers:12400, avatar:'/images/sample1.jpg', access:['FREE','ABO','PPV'] },
  { id:2, handle:'sofia', name:'Sofia Rivera', city:'Madrid (ES)', langs:['ES','EN','FR'], followers:9800, avatar:'/images/sample2.jpg', access:['FREE','PPV'] },
  { id:3, handle:'lena', name:'Lena Martin', city:'Lyon (FR)', langs:['FR','EN'], followers:15100, avatar:'/images/sample3.jpg', access:['FREE','ABO'] },
  { id:4, handle:'maya', name:'Maya Flores', city:'Zurich (CH)', langs:['DE','EN','FR'], followers:20100, avatar:'/images/sample4.jpg', access:['FREE','ABO','PPV'] }
];
