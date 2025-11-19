
export const store = {
  get<T>(k:string, fallback:T):T{ try{ return JSON.parse(localStorage.getItem(k) || "") }catch{ return fallback } },
  set<T>(k:string, v:T){ localStorage.setItem(k, JSON.stringify(v)) }
}
