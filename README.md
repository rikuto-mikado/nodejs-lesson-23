# Node.js Template Engines: Handlebars vs Pug

## What I Learned

This lesson explored different template engines for rendering dynamic HTML in Node.js/Express applications, focusing on **Handlebars** and comparing it with **Pug**.

### Key Takeaways

1. **Handlebars Block Helpers**:
   - `{{#if}}`, `{{#each}}`, `{{ else }}` for conditional rendering and iteration
   - Must close blocks with `{{/if}}` and `{{/each}}`

2. **Context Access in Loops**:
   - Inside `{{#each}}`, use `{{ this.property }}` to access current item properties
   - Example: `{{#each prods}}` → `{{ this.title }}`

3. **Array Length Limitation**:
   - Handlebars cannot evaluate `products.length` in conditionals
   - Must pass pre-computed boolean: `hasProducts: products.length > 0`
   - See: `routes/shop.js:12-13`

4. **Layout Configuration**:
   - express-handlebars looks for `views/layouts/main.handlebars` by default
   - Must explicitly disable with `defaultLayout: false` if not using layouts
   - See: `app.js:11`

5. **Template Engine Setup**:
   - Modern express-handlebars (v6+) requires `.engine()` method
   - Configure extension and layout settings during initialization

## Template Engines Comparison

| Feature | Handlebars (.hbs) | Pug | EJS |
|---------|-------------------|-----|-----|
| **Syntax** | HTML-like with `{{ }}` | Indentation-based, no closing tags | HTML with `<% %>` tags |
| **Learning Curve** | Easy (familiar HTML) | Medium (unique syntax) | Easy (HTML + JS) |
| **Logic Separation** | Strict (minimal logic) | Moderate | Flexible (full JS) |
| **Readability** | High for HTML developers | High once learned | Medium |
| **Custom Helpers** | Built-in support | Built-in filters | Manual implementation |

## Handlebars Syntax vs Pug

### Handlebars Example
```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
    <title>{{ pageTitle }}</title>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <h1>{{ heading }}</h1>
    {{#if products.length}}
        <ul>
            {{#each products}}
                <li>{{ this.name }} - ${{ this.price }}</li>
            {{/each}}
        </ul>
    {{else}}
        <p>No products available</p>
    {{/if}}
</body>
</html>
```

### Pug Example (Same Output)
```pug
doctype html
html(lang="en")
  head
    title= pageTitle
    link(rel="stylesheet", href="/css/main.css")
  body
    h1= heading
    if products.length
      ul
        each product in products
          li #{product.name} - $#{product.price}
    else
      p No products available
```

## Handlebars Core Syntax

### Variables and Expressions
```handlebars
{{ pageTitle }}           <!-- Simple variable -->
{{ this.title }}          <!-- Context property inside #each -->
```

### Block Helpers

#### Conditionals
```handlebars
{{#if hasProducts}}
  <p>Products available!</p>
{{ else }}
  <p>No products</p>
{{/if}}
```

**Important**: Handlebars cannot evaluate `array.length` directly in conditionals. You must pass a pre-computed boolean:
```javascript
// Server-side
res.render('shop', {
  prods: products,
  hasProducts: products.length > 0  // Convert to boolean
});
```

#### Iteration
```handlebars
{{#each prods}}
  <h2>{{ this.title }}</h2>        <!-- Access current item -->
  <p>${{ this.price }}</p>
{{/each}}
```

Inside `{{#each}}`, use `{{ this.property }}` to access properties of the current item.

### Real Example from shop.hbs
```handlebars
{{#if hasProducts}}
  <div class="grid">
    {{#each prods}}
      <article class="card product-item">
        <h1 class="product__title">{{ this.title }}</h1>
        <h2 class="product__price">${{ this.price }}</h2>
      </article>
    {{/each}}
  </div>
{{ else }}
  <h1>No Products</h1>
{{/if}}
```

## Setup in Express

### Handlebars Setup
```javascript
const expressHbs = require('express-handlebars');

// Modern API (v6+)
app.engine('handlebars', expressHbs.engine());
app.set('view engine', 'handlebars');
app.set('views', 'views');
```

### Pug Setup
```javascript
app.set('view engine', 'pug');
app.set('views', 'views');
```

## Key Differences

### 1. Logic Handling
- **Handlebars**: Limited logic (only `if`, `each`, `unless`). Promotes separation of concerns.
- **Pug**: More flexible with JavaScript expressions.

### 2. Syntax Style
- **Handlebars**: Keeps standard HTML structure, adds template syntax with `{{ }}`.
- **Pug**: Completely different syntax based on indentation (like Python).

### 3. Partials/Layouts
- **Handlebars**: Uses `{{> partial}}` for partials and layout system.
- **Pug**: Uses `extends` and `block` for template inheritance.

## When to Use Which?

### Use Handlebars When:
- Team is familiar with HTML but not template languages
- You want to enforce strict logic-view separation
- Working with designers who need to edit templates
- Need mustache-compatible syntax

### Use Pug When:
- You prefer concise, minimal syntax
- Comfortable with indentation-based languages
- Want more flexibility in templates
- Need complex template inheritance

### Use EJS When:
- You want to write plain JavaScript in templates
- Minimal learning curve is priority
- Need maximum flexibility

## Challenges Faced

### 1. express-handlebars API Change
**Error**: `TypeError: expressHbs is not a function`

**Problem**: The `express-handlebars` package changed its API in v6+. The old syntax was:
```javascript
app.engine('handlebars', expressHbs());  // [X] No longer works
```

**Solution**: Use the new `.engine()` method:
```javascript
app.engine('handlebars', expressHbs.engine());  // [OK] Correct
```

Or destructure on import:
```javascript
const { engine } = require('express-handlebars');
app.engine('handlebars', engine());
```

### 2. Understanding Template Logic Limitations
Handlebars intentionally limits logic in templates. This means:
- No complex JavaScript expressions
- No direct variable assignment
- Must use helpers for custom logic

This is **by design** to maintain clean separation between business logic and presentation.

### 3. Handlebars Default Layout Behavior
**Error**: `ENOENT: no such file or directory, open '.../views/layouts/main.handlebars'`

**Problem**: express-handlebars **automatically looks for a layout file** by default, even when you don't want to use layouts.

**Solution**: Explicitly disable layouts if you're using complete HTML in each template:
```javascript
app.engine('hbs', expressHbs.engine({ defaultLayout: false }));
```

**Q: Why does Handlebars need `hasProducts: products.length > 0` in render data?**

**A**: Unlike Pug, Handlebars cannot directly evaluate `array.length` in conditionals. This won't work:
```handlebars
{{#if products.length}}  <!-- Doesn't work as expected -->
```

You must convert it to a boolean server-side and pass it explicitly:
```javascript
res.render('shop', {
  products,
  hasProducts: products.length > 0  // Pre-computed boolean
});
```

## Conclusion

Both Handlebars and Pug are excellent template engines with different philosophies:
- **Handlebars**: Safe, familiar, logic-minimal
- **Pug**: Concise, powerful, expressive

The choice depends on team preferences, project requirements, and design constraints. For this project, I explored both to understand their strengths and trade-offs.
