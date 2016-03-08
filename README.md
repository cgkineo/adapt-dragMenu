# adapt-dragMenu

**Drag Menu** is a 'click and drag' *menu* for use with the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  

Each page of content represents a uniquely positioned button on a background image which the user can explore by clicking and dragging around. An accompanying, static, icon is used for accessibility. The **Drag Menu** allows you to direct the learner to either further menus (sub menus) or to one or more pages of content. The default is to show a title and a related icon.

## Settings Overview

The attributes listed below are used in *course.json* and *contentObjects.json* to configure **Drag Menu**, and are properly formatted as JSON in [*example.json*](https://github.com/cgkineo/adapt-dragMenu/blob/master/example.json).

### Attributes

*course.json* 

**_dragMenu** (object): Holds all of the **Drag Menu** attributes in course.json

**_background** (object): Defines the background image of the menu. It contains values for **_src**, **_height** and **_width**

>**_src** (string): File name (including path) of the background image. Path should be relative to the *src* folder (e.g., *"course/en/images/t05.jpg"*)

>**_height** (number): Sets the height of the background image and the boundary of the menu. Value should match background height

>**_width** (number): Sets the width of the background image and the boundary of the menu. Value should match background width

**_hasQuicknav** (boolean): Sets whether the fixed, centrally aligned, quicknav renders at the bottom of the screen

**_hasArrows** (object): Contains values for **_isEnabled**, **_arrowTopIcon**, **_arrowRightIcon**, **_arrowDownIcon** and **_arrowLeftIcon**

>**_isEnabled** (boolean): Sets whether to display the directional arrows

>**_arrowTopIcon** (string): Sets the top arrow icon. Default is `icon-controls-up`

>**_arrowRightIcon** (string): Sets the right arrow icon. Default is `icon-controls-right`

>**_arrowDownIcon** (string): Sets the down arrow icon. Default is `icon-controls-down`

>**_arrowLeftIcon** (string): Sets the left arrow icon. Default is `icon-controls-left`

**_instructionOverlay** (object) Contains values for **_isEnabled**, **body** and **_graphic**.

>**_isEnabled** (boolean): Sets whether to display the instructional overlay

>**body** (string): Text that appears on the instructional overlay. Used in conjunction with an image to explain how to use the menu

>**_graphic** (string): Image that appears alongside the body text. Used to visualise usage instructions

*contentObjects.json*

**_dragMenuItem** (object): Holds all of the **Drag Menu** attributes in contentObjects.json

>**_icon** (string): File name (including path) of the menu item icon. Path should be relative to the *src* folder (e.g., *"course/en/images/t05.jpg"*)

>**_position** (object): Contains values for **_left**, and **_top**.

>>**_left** (number): Sets the left position, in percentage, of the menu item

>>**_top** (number): Sets the top position, in percentage, of the menu item
    
### Accessibility

Designed to work with AA.

## Limitations
 
No known limitations.  

----------------------------
**Version number:**  1.0.0   
**Framework versions:**  2.0.0     
**Author / maintainer:** CGK  
**Accessibility support:** WAI AA   
**RTL support:** No 
**Cross-platform coverage:** Chrome, IE11, Safari for iPad (iOS 8+9) - Requires further testing