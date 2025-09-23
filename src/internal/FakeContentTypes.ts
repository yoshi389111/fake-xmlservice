// `XmlService.ContentTypes` is declared as a numeric enum in "@types/google-apps-script@2.0.0".
// However, in GAS it is implemented as a custom enumeration structure.
//
// ```
// function testXmlService() {
//   const el = XmlService.ContentTypes.ELEMENT;
//   console.log(typeof el); // => "object"
//   console.log(el.constructor.name); // => "Object"
//   console.log(Object.getOwnPropertyNames(el));
//     // => [ 'toString', 'name', 'toJSON', 'ordinal',
//     //      'compareTo', 'CDATA', 'COMMENT', 'DOCTYPE',
//     //      'ELEMENT', 'ENTITYREF', 'PROCESSINGINSTRUCTION', 'TEXT' ]
//   console.log(el.toString); // => "[Function: toString]"
//   console.log(el.toString()); // => "ELEMENT"
//   console.log(el.name); // => "[Function: toString]"
//   console.log(el.name()); // => "ELEMENT"
//   console.log(el.toJSON); // => "[Function: toString]"
//   console.log(el.toJSON()); // => "ELEMENT"
//   console.log(el.ordinal); // => [Function: ordinal]
//   console.log(el.ordinal()); // => 3
//   console.log(el.compareTo);  // => [Function: compareTo]
//   console.log(el.compareTo(XmlService.ContentTypes.TEXT)); // => -3
//   console.log(Object.isFrozen(el)); // => false
//   console.log(XmlService.ContentTypes.ELEMENT === XmlService.ContentTypes.TEXT.ELEMENT); // => true
//   console.log(XmlService.ContentTypes === XmlService.ContentTypes.CDATA); // => true
//   console.log(XmlService.ContentTypes.toString()); // => "CDATA"
// }
// ```
//
// The goal is to proactively find bugs in GAS,
// not to implement it according to "@types/google-apps-script"
// or to be as close as possible to the GAS implementation.
//
// Implement it as follows:
//
// - We will implement it as a custom enum object, rather than using a numeric-type enum.
// - Methods not listed in the official documentation will not be implemented.
// - However, it does implement the `toString` and `toJSON` methods.
// - In the GAS implementation, properties can be rewritten,
//   but in this implementation, an error is thrown if an attempt is made to rewrite them.

/**
 * Makes an object immutable by preventing modifications to its properties.
 * @param obj The object to make immutable.
 * @returns The immutable object.
 */
function makeStrictImmutable<T extends object>(obj: T): T {
  return new Proxy(obj, {
    set(_target: T, prop: string | symbol, _value: unknown) {
      throw new Error(
        `Property "${String(prop)}" is immutable and cannot be changed`
      );
    },
    deleteProperty(_target: T, prop: string | symbol) {
      throw new Error(`Property "${String(prop)}" cannot be deleted`);
    },
    defineProperty(
      _target: T,
      prop: string | symbol,
      _descriptor: PropertyDescriptor
    ) {
      throw new Error(`Property "${String(prop)}" cannot be redefined`);
    },
  });
}

/**
 * Creates a fake enum object.
 * @param names The names of the enum members.
 * @returns The fake enum object.
 */
function createFakeEnum<const T extends readonly string[]>(
  names: T
): Record<T[number], number> {
  const enums = names.reduce((acc, name) => {
    function toString() {
      return name;
    }
    acc[name] = makeStrictImmutable({
      toString,
      toJSON: toString,
    }) as unknown as number;
    return acc;
  }, {} as Record<string, number>);
  return makeStrictImmutable(enums) as Record<T[number], number>;
}

/**
 * A fake implementation of GoogleAppsScript.XML_Service.ContentType.
 */
export const FakeContentTypes: typeof GoogleAppsScript.XML_Service.ContentType =
  createFakeEnum([
    "CDATA",
    "COMMENT",
    "DOCTYPE",
    "ELEMENT",
    "ENTITYREF",
    "PROCESSINGINSTRUCTION",
    "TEXT",
  ] as const);
