const base = {
  primary: '#2488DB',

  inputBackground: '#313131',
  inputColor: '#CCCCCC',
  inputBorder: '#3C3C3C',

  componentBackground: '#181818',
  componentBorder: '#2B2B2B',
  componentColor: '#CCCCCC',

  dropAreaBackground: '#2488DB40',

  openBackground: '#1F1F1F',
  shadow: '#00000070',
}

export const darkTheme = {
  /**
   * Common
   */
  background: base.componentBackground,
  outline: base.primary,
  componentBackground: base.componentBackground,
  componentBorder: base.componentBorder,
  componentColor: base.componentColor,
  dropAreaBackground: base.dropAreaBackground,
  primary: `${base.primary}`,

  primary90: `${base.primary}90`,
  primary80: `${base.primary}80`,
  primary70: `${base.primary}70`,
  primary60: `${base.primary}60`,
  primary50: `${base.primary}50`,
  primary40: `${base.primary}40`,
  primary30: `${base.primary}30`,
  primary20: `${base.primary}20`,
  primary10: `${base.primary}10`,

  componentColor90: `${base.componentColor}90`,
  componentColor80: `${base.componentColor}80`,
  componentColor70: `${base.componentColor}70`,
  componentColor60: `${base.componentColor}60`,
  componentColor50: `${base.componentColor}50`,
  componentColor40: `${base.componentColor}40`,
  componentColor30: `${base.componentColor}30`,
  componentColor20: `${base.componentColor}20`,
  componentColor10: `${base.componentColor}10`,

  /**
   * Scroll Bar
   */
  scrollbarThumb: 'rgba(100, 100, 100, 0.4)',
  scrollbarThumbHover: 'rgba(100, 100, 100, 0.7)',
  scrollbarThumbActive: 'rgba(255, 255, 255, 0.6)',

  /**
   * Inputs
   */
  inputBackground: base.inputBackground,
  inputColor: base.inputColor,
  inputBorder: base.inputBorder,

  selectBackground: base.inputBackground,
  selectColor: base.inputColor,
  selectBorder: base.inputBorder,

  textareaBackground: base.inputBackground,
  textareaColor: base.inputColor,
  textareaBorder: base.inputBorder,

  /**
   * Buttons
   */
  buttonBackground: 'transparent',
  buttonColor: '#CCCCCC',
  buttonHoverBackground: '#5A5D5E50',
  buttonActiveBackground: '#5A5D5E50',
  buttonPressedBackground: `${base.primary}40`,
  buttonPressedBorder: base.primary,
  buttonPressedColor: '#FFFFFF',

  buttonPrimaryBackground: '#0078D4',
  buttonPrimaryColor: '#FFFFFF',
  buttonPrimaryHoverBackground: '#026EC1',
  buttonPrimaryActiveBackground: '#026EC1',

  /**
   * In-App Notes
   */
  inAppNoteColor: '#CCCCCC60',
  inAppNoteIconColor: '#CCCCCC',
  inAppNoteNoProjectsBackground: '#181818',
  inAppNoteNoWorkflowsBackground: '#181818',

  /**
   * Top Bar
   */
  topBarBackground: base.componentBackground,
  topBarBorder: base.componentBorder,

  /**
   * Top Bar - Widget Palette
   */
  paletteBackground: base.componentBackground,
  paletteBorder: `${base.primary}25`,
  paletteShadow: base.shadow,
  paletteNoteColor: base.componentColor,
  paletteTabBackground: `${base.primary}25`,
  paletteTabColor: base.componentColor,
  paletteTabHoverBackground: base.openBackground,
  paletteTabHoverColor: '#FFFFFF',
  paletteSectionBackground: base.openBackground,
  paletteItemBackground: 'transparent',
  paletteItemColor: base.componentColor,
  paletteItemHoverBackground: '#37373D',
  paletteItemHoverColor: base.componentColor,

  /**
   * Top Bar - Shelf
   */
  shelfDropAreaBackground: base.dropAreaBackground,

  shelfTabColor: base.componentColor,
  shelfTabOpenBackground: base.openBackground,
  shelfTabOpenColor: '#FFFFFF',

  shelfWidgetBoxBackground: base.openBackground,
  shelfWidgetBoxBorder: base.componentBorder,
  shelfWidgetBoxShadow: base.shadow,
  shelfWidgetBoxWidgetBorder: '#323232',

  /**
   * Workflow Switcher
   */
  workflowSwitcherBackground: base.componentBackground,
  workflowSwitcherBorder: base.componentBorder,
  workflowSwitcherDropAreaBackground: base.dropAreaBackground,

  workflowSwitcherTabBackground: base.componentBackground,
  workflowSwitcherTabColor: base.componentColor,
  workflowSwitcherTabHoverBackground: base.openBackground,
  workflowSwitcherTabHoverColor: base.componentColor,
  workflowSwitcherTabOpenBackground: base.openBackground,
  workflowSwitcherTabOpenColor: '#FFFFFF',

  /**
   * Worktable
   */
  worktableBackground: base.openBackground,

  widgetLayoutItemBorder: '#323232',
  widgetLayoutItemEditHoverBorder: '#565656',
  widgetLayoutItemResizingBorder: '#FFFFFF',
  widgetLayoutItemResizingOpacity: '0.5',
  widgetLayoutGhostBackground: base.dropAreaBackground,
  widgetLayoutItemShadow: base.shadow,

  /**
   * Modal Screens
   */
  modalScreenBackground: '#1F1F1F',
  modalScreenBorder: base.componentBorder,
  modalScreenColor: base.componentColor,

  settingsScreenPanelColor: '#CCCCCC',

  appManagerListBackground: base.componentBackground,
  appManagerListItemBackground: base.componentBackground,
  appManagerListItemColor: base.componentColor,
  appManagerListItemHoverBackground: '#2A2D2E',
  appManagerListItemHoverColor: base.componentColor,
  appManagerListItemSelectedBackground: '#37373D',
  appManagerListItemSelectedColor: '#FFFFFF',
  appManagerListItemDropAreaBackground: base.dropAreaBackground,

  projectManagerListBackground: base.componentBackground,
  projectManagerListItemBackground: base.componentBackground,
  projectManagerListItemColor: base.componentColor,
  projectManagerListItemHoverBackground: '#2A2D2E',
  projectManagerListItemHoverColor: base.componentColor,
  projectManagerListItemSelectedBackground: '#37373D',
  projectManagerListItemSelectedColor: '#FFFFFF',
  projectManagerListItemDropAreaBackground: base.dropAreaBackground,

  aboutScreenBorder: base.componentBorder,
  aboutScreenLeftBackground: base.componentBackground,
  aboutScreenLeftColor: base.componentColor,
  aboutScreenRightBackground: '#1F1F1F',
  aboutScreenRightColor: base.componentColor,
  aboutScreenRightLinkColor: base.primary,
  aboutScreenLogoColor1: '#3B3B3B',
  aboutScreenLogoColor2: '#FFFFFF',
  aboutScreenLogoBorderColor: '#181818',

  /**
   * Widget
   */
  widgetBackground: '#262626',
  widgetColor: base.componentColor,
  widgetHeaderBackground: '#262626',
  widgetHeaderBorder: '#323232',
  widgetHeaderColor: base.componentColor,
}
