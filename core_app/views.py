from django.shortcuts import render, redirect
from projects.models import Project
from projects.serializer import ProjectSerializer
from django.core.paginator import Paginator
from django.http import JsonResponse
from .forms import ContactForm
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib import messages
from .models import Profile, FilePDF
from django.contrib.auth.models import User
from django.http import HttpResponse
from blog.models import Tag


def core_app_view(request):
    # Always show 3 Projects in paginated form.
    number_of_projects_on_page = 3
    # Everything tag.
    everything_tag_name = "everything".title()
    everything_tag_slug = "everything"
    # Initial Projects. Filter is Everything, paginate all of the Projects.
    projects = Project.objects.all().order_by('-date_posted')
    paginator = Paginator(projects, number_of_projects_on_page)
    first_page = paginator.page(1)
    page_n = 1

    # POST request can be:
    # (1) contact form sent
    # (2) Projects filtered by tags
    # (3) changing Projects pagination page
    if request.method == 'POST':
        # Get the completed form.
        form = ContactForm(request.POST)
        # If the completed form is valid, process content.
        if form.is_valid():
            # Save form content, and extract information.
            form.save()
            name = form.cleaned_data['name']
            subject = form.cleaned_data['subject']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']
            # Prepare incoming message to be sent to myself, convert it to an EmailMessage, and send email to myself.
            incoming_message = {
                "subject": subject + " from {0}, through Django".format(name),
                "body": message + "\n\nYou received this email from '{0}', email: {1}".format(name, email)
            }
            incoming_email = EmailMessage(
                subject=incoming_message["subject"],
                body=incoming_message["body"],
                from_email=settings.EMAIL_HOST_USER,
                to=[settings.EMAIL_HOST_USER])
            #incoming_email.send(fail_silently=False)
            # Prepare thank you message to be sent to myself, convert it to an EmailMessage, and send email to myself.
            thank_you_message = {
                "subject": "Thank you for contacting me! (Mark Csizmadia)",
                "body": ("Dear {0},\n\nThank you for contacting me!\n\n"
                         "I hope you enjoyed browsing through my website. "
                         "I will get back to you within 24 hours!\n\n"
                         "Kind Regards,\nMark Csizmadia".format(name))
            }
            thank_you_email = EmailMessage(
                subject=thank_you_message["subject"],
                body=thank_you_message["body"],
                from_email=settings.EMAIL_HOST_USER,
                to=[email])
            #thank_you_email.send(fail_silently=False)
            # User feedback as message to confirm that they contacted me successfully via email.
            messages.success(request, f'Thank you for your message, {name}!')
            return redirect('core_app_view')
        else:
            # If visitor interacts with the Projects section.
            # Retrieve the filter slug, and the upcoming page number.
            filtered_tag_slug_jquery = request.POST.get('filtered_tag_slug_jquery', None)
            page_n = request.POST.get('page_n', None)

            # Filter Projects.
            # If filter tag is everything, get all of the Projects.
            if filtered_tag_slug_jquery == everything_tag_slug:
                projects = Project.objects.all().order_by('-date_posted')
            # If filter tag is anything other than everything, filter Projects.
            else:
                t = Tag.objects.get(slug=filtered_tag_slug_jquery)
                projects = Project.objects.filter(tags=t).order_by('-date_posted')

            # Paginate the filtered Projects.
            paginator = Paginator(projects, number_of_projects_on_page)

            # Pagination logic.
            # If the upcoming page has a next page, get the next page number.
            if paginator.page(page_n).has_next():
                next_page_n = paginator.page(page_n).next_page_number()
            # If the upcoming page doesn't have a next page, set the next page number to the upcoming page number.
            else:
                next_page_n = page_n
            # If the upcoming page has a previous page, get the previous page number.
            if paginator.page(page_n).has_previous():
                previous_page_n = paginator.page(page_n).previous_page_number()
            # If the upcoming page doesn't have a prev. page, set the prev. page number to the upcoming page number.
            else:
                previous_page_n = page_n

        # Serialize the filtered and paginated Projects into JSON format for processing in jQuery.
        serializer = ProjectSerializer(paginator.page(page_n).object_list, many=True)

        # Dictionary for processing POST data in jQuery.
        data = {
            "serializer": serializer.data,
            "page_n": page_n,
            "num_pages":paginator.num_pages,
            "next_page_n": next_page_n,
            "previous_page_n": previous_page_n
        }

        return JsonResponse(data, safe=False)
    # If not POST request, lean the form.
    else:
        form = ContactForm()

    # Build context for accessing data in HTML.
    context = {
        "title": "Mark Csizmadia | Personal Website",
        "paginator": paginator,
        "first_page": first_page,
        "page_n": page_n,
        "form": form,
        "mark_profile": Profile.objects.get(user=User.objects.get(username="mark")),
        "cv_file_object": FilePDF.objects.get(identifier="cv"),
        "project_report_file_object": FilePDF.objects.get(identifier="project_report"),
        "internship_report_file_object": FilePDF.objects.get(identifier="internship_report"),
        "tags": Tag.objects.all(),
        "everything_tag_name": everything_tag_name,
        "everything_tag_slug": everything_tag_slug
    }

    return render(request, 'core_app/base.html', context)


def download_pdf(request, pdf_file_identifier):
    file_object = FilePDF.objects.get(identifier=pdf_file_identifier)
    response = HttpResponse(file_object.pdf, content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename={0}'.format(file_object.title + ".pdf")
    return response

