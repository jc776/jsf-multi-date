package com.jc776.eetest;

import java.io.IOException;
import java.util.Date;
import java.util.Set;
import java.util.TreeSet;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.render.FacesRenderer;

import org.primefaces.json.JSONArray;
import org.primefaces.renderkit.CoreRenderer;
import org.primefaces.util.WidgetBuilder;

@FacesRenderer(componentFamily = MultiDatePicker.COMPONENT_FAMILY, rendererType = MultiDatePickerRenderer.RENDERER_TYPE)
public class MultiDatePickerRenderer extends CoreRenderer {
  public static final String RENDERER_TYPE = "com.jc776.MultiDatePickerRenderer";
  public static final String WIDGET_MULTIDATEPICKER = "MultiDatePicker";
  public static final String TAG_DIV = "div";
  public static final String ATTR_ID = "id";

  @Override
  public void decode(final FacesContext context, final UIComponent component) {
    final String submittedValue = context.getExternalContext()
        .getRequestParameterMap().get(component.getClientId(context));
    // [10000000, 10000001]
    final JSONArray times = new JSONArray(submittedValue);
    final Set<Date> dates = new TreeSet<>();
    times.forEach(obj -> {
      final long time = (Long) obj;
      dates.add(new Date(time));
    });
    ((MultiDatePicker) component).setSubmittedValue(dates);
  }

  @Override
  public void encodeEnd(final FacesContext context, final UIComponent component)
      throws IOException {
    final MultiDatePicker multiDatePicker = (MultiDatePicker) component;
    this.encodeMarkup(context, multiDatePicker);
    this.encodeScript(context, multiDatePicker);
  }

  protected void encodeMarkup(final FacesContext context,
      final MultiDatePicker multiDatePicker) throws IOException {
    final ResponseWriter writer = context.getResponseWriter();
    writer.startElement(MultiDatePickerRenderer.TAG_DIV, multiDatePicker);
    writer.writeAttribute(MultiDatePickerRenderer.ATTR_ID,
        multiDatePicker.getClientId(), null);
    writer.endElement(MultiDatePickerRenderer.TAG_DIV);
  }

  protected void encodeScript(final FacesContext context,
      final MultiDatePicker multiDatePicker) throws IOException {
    final String clientId = multiDatePicker.getClientId();
    final String widgetVar = multiDatePicker.resolveWidgetVar();
    final WidgetBuilder wb = this.getWidgetBuilder(context);
    wb.initWithDomReady(MultiDatePickerRenderer.WIDGET_MULTIDATEPICKER,
        widgetVar, clientId);
    if (multiDatePicker.getValue() != null) {
      final JSONArray array = new JSONArray();
      for (final Date date : multiDatePicker.getValue()) {
        array.put(date.getTime());
      }
      wb.nativeAttr(MultiDatePicker.PropertyKeys.value.name(),
          array.toString());
    }
    if (multiDatePicker.getMinDate() != null) {
      wb.attr(MultiDatePicker.PropertyKeys.minDate.name(),
          multiDatePicker.getMinDate().getTime());
    }
    if (multiDatePicker.getMaxDate() != null) {
      wb.attr(MultiDatePicker.PropertyKeys.maxDate.name(),
          multiDatePicker.getMaxDate().getTime());
    }
    wb.finish();
  }
}
