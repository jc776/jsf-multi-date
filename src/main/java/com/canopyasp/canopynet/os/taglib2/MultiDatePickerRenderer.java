package com.canopyasp.canopynet.os.taglib2;

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
	public static final String RENDERER_TYPE = "com.canopyasp.canopynet.os.taglib2.MultiDatePickerRenderer"; //$NON-NLS-1$
	public static final String WIDGET_MULTIDATEPICKER = "MultiDatePicker"; //$NON-NLS-1$
	public static final String TAG_DIV = "div"; //$NON-NLS-1$
	public static final String ATTR_ID = "id"; //$NON-NLS-1$

	@Override
	public void decode(final FacesContext context, final UIComponent component) {
		final MultiDatePicker multiDatePicker = (MultiDatePicker) component;
		this.decodeBehaviors(context, multiDatePicker);
		final String submittedValue = context.getExternalContext().getRequestParameterMap()
				.get(component.getClientId(context));
		if (submittedValue != null) {
			// [10000000, 10000001]
			final JSONArray times = new JSONArray(submittedValue);
			final Set<Date> dates = new TreeSet<>();
			times.forEach(obj -> {
				final long time = (Long) obj;
				dates.add(new Date(time));
			});
			multiDatePicker.setSubmittedValue(dates);
		}
	}

	@Override
	public void encodeEnd(final FacesContext context, final UIComponent component) throws IOException {
		final MultiDatePicker multiDatePicker = (MultiDatePicker) component;
		this.encodeMarkup(context, multiDatePicker);
		this.encodeScript(context, multiDatePicker);
	}

	@SuppressWarnings("resource")
	protected void encodeMarkup(final FacesContext context, final MultiDatePicker multiDatePicker) throws IOException {
		final ResponseWriter writer = context.getResponseWriter();
		writer.startElement(MultiDatePickerRenderer.TAG_DIV, multiDatePicker);
		writer.writeAttribute(MultiDatePickerRenderer.ATTR_ID, multiDatePicker.getClientId(), null);
		writer.endElement(MultiDatePickerRenderer.TAG_DIV);
	}

	protected void encodeScript(final FacesContext context, final MultiDatePicker multiDatePicker) throws IOException {
		final String clientId = multiDatePicker.getClientId();
		final String widgetVar = multiDatePicker.resolveWidgetVar();
		final WidgetBuilder wb = this.getWidgetBuilder(context);
		wb.initWithDomReady(MultiDatePickerRenderer.WIDGET_MULTIDATEPICKER, widgetVar, clientId);
		jsonDates(multiDatePicker.getValue(), wb, MultiDatePicker.PropertyKeys.value);
		jsonDates(multiDatePicker.getHighlightedDates(), wb, MultiDatePicker.PropertyKeys.highlightedDates);
		if (multiDatePicker.getMinDate() != null) {
			wb.attr(MultiDatePicker.PropertyKeys.minDate.name(), multiDatePicker.getMinDate().getTime());
		}
		if (multiDatePicker.getMaxDate() != null) {
			wb.attr(MultiDatePicker.PropertyKeys.maxDate.name(), multiDatePicker.getMaxDate().getTime());
		}
		wb.attr(MultiDatePicker.PropertyKeys.readOnly.name(), multiDatePicker.isReadOnly());
		this.encodeClientBehaviors(context, multiDatePicker);
		wb.finish();
	}

	private static void jsonDates(final Set<Date> dates, final WidgetBuilder wb,
			final MultiDatePicker.PropertyKeys propertyKey) throws IOException {
		if (dates != null) {
			final JSONArray array = new JSONArray();
			for (final Date date : dates) {
				array.put(date.getTime());
			}
			wb.nativeAttr(propertyKey.name(), array.toString());
		}
	}
}
