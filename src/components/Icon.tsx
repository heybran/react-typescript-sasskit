import { SVGProps } from "react"

/**
 * To type the svgAttrs object in TypeScript,
 * we can define an interface that extends the React.SVGProps<SVGSVGElement> interface.
 */
interface SvgAttrs extends SVGProps<SVGSVGElement> {
  className: string;
}

const svgAttrs: SvgAttrs = {
  'aria-hidden': true,
  /**
   * While ARIA is primarily used to express semantics, 
   * there are some situations where hiding an element's semantics 
   * from assistive technologies is helpful. 
   * This is done with the presentation role or its synonym role none, 
   * which declare that an element is being used only for 
   * presentation and therefore does not have any accessibility semantics.
   */
  role: "presentation",
  focusable: false,
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: "icon"
}

export const SearchIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" {...svgAttrs}>
    <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.0001 14.0001L11.1001 11.1001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export const ShoppingBag = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...svgAttrs}>
      <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export const NotificationIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...svgAttrs}>
      <path d="M12.0201 2.90991C8.71009 2.90991 6.02009 5.59991 6.02009 8.90991V11.7999C6.02009 12.4099 5.76009 13.3399 5.45009 13.8599L4.30009 15.7699C3.59009 16.9499 4.08009 18.2599 5.38009 18.6999C9.69009 20.1399 14.3401 20.1399 18.6501 18.6999C19.8601 18.2999 20.3901 16.8699 19.7301 15.7699L18.5801 13.8599C18.2801 13.3399 18.0201 12.4099 18.0201 11.7999V8.90991C18.0201 5.60991 15.3201 2.90991 12.0201 2.90991Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
      <path d="M13.8699 3.19994C13.5599 3.10994 13.2399 3.03994 12.9099 2.99994C11.9499 2.87994 11.0299 2.94994 10.1699 3.19994C10.4599 2.45994 11.1799 1.93994 12.0199 1.93994C12.8599 1.93994 13.5799 2.45994 13.8699 3.19994Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
    </svg>
  )
}
